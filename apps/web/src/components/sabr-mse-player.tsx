import { TypeTypeMsePlayer, type TypeTypeMseQuality } from "@typetype/mse";
import { useEffect, useRef } from "react";
import { useLatestValue } from "../hooks/use-latest-value";
import { useSabrQualitySwitch } from "../hooks/use-sabr-quality-switch";
import { toAbsoluteApiUrl } from "../lib/env";
import { isAbortError, playWithMuteFallback } from "../lib/sabr-playback-retry";
import type { SabrPlaybackConfig } from "../lib/sabr-source";
import { registerSabrVidstackControls } from "../lib/sabr-vidstack-bridge";
import { useAuthStore } from "../stores/auth-store";

type Props = {
  config: SabrPlaybackConfig;
  video: HTMLVideoElement | null;
  startTime: number;
  autoplay: boolean;
  initialVolume: number;
  initialMuted: boolean;
  settingsReady: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onError: () => void;
  onSeekReady: (seek: (seconds: number) => void) => void;
  onPositionReaderChange: (reader: (() => number | null) | null) => void;
};

function positionMs(video: HTMLVideoElement): number {
  return Math.max(0, Math.round(video.currentTime * 1000));
}

function runSeek(
  player: TypeTypeMsePlayer | null,
  position: number,
  flag: { current: boolean },
  onError: () => void,
) {
  flag.current = true;
  void player
    ?.seek(position)
    .catch((error: unknown) => {
      if (!isAbortError(error)) onError();
    })
    .finally(() => {
      flag.current = false;
    });
}

export function SabrMsePlayer({
  config,
  video,
  startTime,
  autoplay,
  initialVolume,
  initialMuted,
  settingsReady,
  onVolumeChange,
  onError,
  onSeekReady,
  onPositionReaderChange,
}: Props) {
  const token = useAuthStore((state) => state.token);
  const engineRef = useRef<TypeTypeMsePlayer | null>(null);
  const qualityRef = useRef<TypeTypeMseQuality | null>(null);
  const pendingPlayRef = useRef(false);
  const seekingRef = useRef(false);
  const latestConfig = useLatestValue(config);
  const latestHandlers = useLatestValue({
    autoplay,
    onError,
    onSeekReady,
    onPositionReaderChange,
    onVolumeChange,
  });
  useSabrQualitySwitch(config, engineRef, qualityRef, seekingRef);
  useEffect(() => {
    if (!video || !settingsReady) return;
    video.volume = Math.min(1, Math.max(0, initialVolume));
    video.muted = initialMuted;
  }, [initialMuted, initialVolume, settingsReady, video]);
  useEffect(() => {
    if (!video) return;
    const initialConfig = latestConfig();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const engine = new TypeTypeMsePlayer(video, {
      endpoint: toAbsoluteApiUrl(""),
      videoId: config.videoId,
      videoItag: initialConfig.videoItag,
      audioItag: initialConfig.audioItag,
      audioTrackId: initialConfig.audioTrackId,
      startTimeMs: Math.max(0, Math.round(startTime)),
      headers,
    });
    engineRef.current = engine;
    qualityRef.current = {
      videoItag: initialConfig.videoItag,
      audioItag: initialConfig.audioItag,
      audioTrackId: initialConfig.audioTrackId,
    };
    const offError = engine.on("error", () => latestHandlers().onError());
    const volumeChange = () => latestHandlers().onVolumeChange?.(video.volume, video.muted);
    const seeking = () => {
      const next = positionMs(video);
      if (!seekingRef.current) runSeek(engine, next, seekingRef, latestHandlers().onError);
    };
    video.addEventListener("volumechange", volumeChange);
    video.addEventListener("seeking", seeking);
    const unregisterControls = registerSabrVidstackControls(video, {
      play: () => {
        pendingPlayRef.current = true;
        video.autoplay = true;
        return engine.play();
      },
      pause: () => {
        pendingPlayRef.current = false;
        video.autoplay = false;
        return engine.pause();
      },
      seek: (seconds) =>
        runSeek(
          engine,
          Math.max(0, Math.round(seconds * 1000)),
          seekingRef,
          latestHandlers().onError,
        ),
    });
    seekingRef.current = true;
    void engine
      .load()
      .then(() => {
        if (latestHandlers().autoplay || pendingPlayRef.current) {
          void playWithMuteFallback(engine, video).catch(() => undefined);
        }
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) latestHandlers().onError();
      })
      .finally(() => {
        seekingRef.current = false;
      });
    latestHandlers().onSeekReady((seconds) =>
      runSeek(
        engine,
        Math.max(0, Math.round(seconds * 1000)),
        seekingRef,
        latestHandlers().onError,
      ),
    );
    latestHandlers().onPositionReaderChange(() => positionMs(video));
    return () => {
      offError();
      unregisterControls();
      video.removeEventListener("volumechange", volumeChange);
      video.removeEventListener("seeking", seeking);
      engine.destroy();
      engineRef.current = null;
      pendingPlayRef.current = false;
      video.autoplay = false;
      latestHandlers().onPositionReaderChange(null);
    };
  }, [config.videoId, latestConfig, latestHandlers, startTime, token, video]);
  return null;
}
