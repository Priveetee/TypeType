import { useCallback, useEffect, useRef } from "react";
import { useMediaPlayer, useMediaRemote, useMediaState } from "../lib/vidstack";

type Props = {
  initialVolume: number;
  initialMuted: boolean;
  settingsReady: boolean;
  autoplay: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
};

export function VolumeRestorer({
  initialVolume,
  initialMuted,
  settingsReady,
  autoplay,
  onVolumeChange,
}: Props) {
  const remote = useMediaRemote();
  const player = useMediaPlayer();
  const volume = useMediaState("volume");
  const muted = useMediaState("muted");
  const canPlay = useMediaState("canPlay");
  const paused = useMediaState("paused");
  const restoredRef = useRef(false);
  const resumeOnReturnRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
  }, []);

  const getPlayerRoot = useCallback((): HTMLElement | null => {
    const root = player?.el;
    return root?.isConnected ? root : null;
  }, [player]);

  const attemptPlay = useCallback(async () => {
    if (!mountedRef.current) return;
    const root = getPlayerRoot();
    if (!root) return;
    const media = root.querySelector<HTMLMediaElement>("video,audio");
    if (!media) return;
    if (media && !media.paused && !media.ended) return;
    await remote.play();
  }, [getPlayerRoot, remote]);

  const tryPlay = useCallback(
    (force: boolean) => {
      if (!settingsReady || !canPlay) return;
      if (!force && !autoplay) return;
      void attemptPlay()
        .then(() => {
          if (!mountedRef.current) return;
          clearRetry();
          if (force) resumeOnReturnRef.current = false;
        })
        .catch(() => {
          if (!force) return;
          if (retryCountRef.current >= 3) return;
          retryCountRef.current += 1;
          const delay = retryCountRef.current * 300;
          if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            if (!mountedRef.current) return;
            void attemptPlay()
              .then(() => clearRetry())
              .catch(() => {});
          }, delay);
        });
    },
    [settingsReady, canPlay, autoplay, attemptPlay, clearRetry],
  );

  useEffect(() => {
    if (!settingsReady || !canPlay || restoredRef.current) return;
    if (!getPlayerRoot()) return;
    restoredRef.current = true;
    try {
      remote.changeVolume(initialVolume);
      if (initialMuted) remote.mute();
    } catch {
      restoredRef.current = false;
    }
  }, [settingsReady, canPlay, remote, initialVolume, initialMuted, getPlayerRoot]);

  useEffect(() => {
    tryPlay(false);
  }, [tryPlay]);

  useEffect(() => {
    if (!settingsReady) return;
    const markResumeIntent = () => {
      resumeOnReturnRef.current = !paused;
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markResumeIntent();
        return;
      }
      if (resumeOnReturnRef.current) tryPlay(true);
    };
    const onPageHide = () => {
      markResumeIntent();
    };
    const onPageShow = () => {
      if (resumeOnReturnRef.current) tryPlay(true);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onPageShow);
    window.addEventListener("online", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onPageShow);
      window.removeEventListener("online", onPageShow);
    };
  }, [settingsReady, paused, tryPlay]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearRetry();
    };
  }, [clearRetry]);

  useEffect(() => {
    if (!restoredRef.current) return;
    onVolumeChange?.(volume, muted);
  }, [volume, muted, onVolumeChange]);

  return null;
}
