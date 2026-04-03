import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useBulletComments } from "../hooks/use-bullet-comments";
import { usePlayerError } from "../hooks/use-player-error";
import { useSaveProgress } from "../hooks/use-progress";
import { useSettings } from "../hooks/use-settings";
import { useVolumeSync } from "../hooks/use-volume-sync";
import {
  useWatchRecommendationTracking,
  useWatchVttAssets,
} from "../hooks/use-watch-layout-assets";
import { detectProvider } from "../lib/provider";
import { useDanmakuStore } from "../stores/danmaku-store";
import { useWatchLayoutStore } from "../stores/watch-layout-store";
import type { VideoStream } from "../types/stream";
import { DanmakuOverlay } from "./danmaku-overlay";
import { PlayerError } from "./player-error";
import { PlayerDefaults, PlayerFocuser } from "./player-internals";
import { VideoPlayer } from "./video-player";
import { WatchCinemaLayout } from "./watch-cinema-layout";
import { WatchDefaultLayout } from "./watch-default-layout";

type Props = {
  stream: VideoStream;
  startTime: number;
};

export function WatchLayout({ stream, startTime }: Props) {
  const navigate = useNavigate();
  const save = useSaveProgress(stream.id);
  const { settings, update, query: settingsQuery } = useSettings();
  const settingsReady =
    (settingsQuery.isSuccess && !settingsQuery.isPlaceholderData) || settingsQuery.isError;
  const isLive = stream.streamType === "live_stream" || stream.streamType === "audio_live_stream";
  const { manifestSrc, playerFailed, qualityFailed, handleError, reset, retryKey } = usePlayerError(
    stream,
    isLive,
  );
  const { on: bulletCommentsOn } = useDanmakuStore();
  const isNicoNico = detectProvider(stream.id) === "nicovideo";
  const { data: bulletComments } = useBulletComments(stream.id, isNicoNico);
  const originalLocale =
    stream.audioStreams?.find((a) => a.audioTrackName?.toLowerCase().includes("original"))
      ?.audioLocale ?? null;
  const cinemaRelated = (stream.related ?? []).slice(0, 3);

  const positionRef = useRef(0);
  const seekRef = useRef<((seconds: number) => void) | null>(null);
  const saveMutateRef = useRef(save.mutate);
  saveMutateRef.current = save.mutate;
  const handleVolumeChange = useVolumeSync(update.mutate);
  const cinemaMode = useWatchLayoutStore((state) => state.cinemaMode);
  const { thumbnailVtt, chaptersVtt } = useWatchVttAssets(stream);

  const saveRef = useRef<(seeked: boolean) => void>(() => {});
  saveRef.current = (seeked: boolean) => {
    const pos = positionRef.current;
    const durationMs = stream.duration * 1000;
    if (pos >= durationMs * 0.95) return;
    if (!seeked && pos < 5000) return;
    saveMutateRef.current(seeked && pos < 5000 ? 0 : pos);
  };
  const handleSave = useCallback(() => saveRef.current(false), []);
  const handleSeekSave = useCallback(() => saveRef.current(true), []);

  useWatchRecommendationTracking(stream, isLive, positionRef);

  const handleTimeUpdate = useCallback((positionMs: number) => {
    positionRef.current = positionMs;
  }, []);

  const handleEnded = useCallback(() => {
    if (!settingsReady || !settings.autoplay) return;
    const next = stream.related?.[0];
    if (!next) return;
    navigate({ to: "/watch", search: { v: next.id } });
  }, [settingsReady, settings.autoplay, stream.related, navigate]);

  useEffect(() => {
    if (isLive) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveRef.current(false);
    };
    const interval = setInterval(() => saveRef.current(false), 10_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isLive]);

  const overlay = (
    <>
      {isNicoNico && bulletCommentsOn && bulletComments && (
        <DanmakuOverlay comments={bulletComments} positionRef={positionRef} />
      )}
      <PlayerFocuser />
      <PlayerDefaults
        defaultQuality={qualityFailed ? undefined : settings.defaultQuality}
        defaultAudioLanguage={settings.defaultAudioLanguage || undefined}
        preferOriginalLanguage={settings.preferOriginalLanguage}
        originalAudioLocale={originalLocale}
        subtitlesEnabled={settings.subtitlesEnabled}
        defaultSubtitleLanguage={settings.defaultSubtitleLanguage || undefined}
      />
    </>
  );

  const playerProps = {
    src: manifestSrc,
    title: stream.title,
    poster: stream.thumbnail,
    streamType: isLive ? "live" : "on-demand",
    startTime,
    subtitles: stream.subtitles,
    sponsorBlockSegments: stream.sponsorBlockSegments,
    thumbnailVtt,
    chaptersVtt,
    initialVolume: settings.volume,
    initialMuted: settings.muted,
    settingsReady,
    autoplay: settingsReady && settings.autoplay,
    originalAudioLocale: originalLocale,
    overlay,
    onVolumeChange: handleVolumeChange,
    onTimeUpdate: handleTimeUpdate,
    onPause: handleSave,
    onSeeked: handleSeekSave,
    onError: handleError,
    onEnded: handleEnded,
    onSeekReady: (seek: (seconds: number) => void) => {
      seekRef.current = seek;
    },
  } as const;

  const player = (
    <>
      <VideoPlayer key={`${stream.id}:${retryKey}`} {...playerProps} />
      {playerFailed && <PlayerError onRetry={reset} />}
    </>
  );

  if (cinemaMode) {
    const widePlayer = (
      <>
        <VideoPlayer
          key={`${stream.id}:${retryKey}`}
          {...playerProps}
          className="w-full h-full dark [--video-aspect-ratio:16/9]"
          mediaClassName="object-cover"
        />
        {playerFailed && <PlayerError onRetry={reset} />}
      </>
    );

    return <WatchCinemaLayout player={widePlayer} stream={stream} related={cinemaRelated} />;
  }

  return <WatchDefaultLayout player={player} stream={stream} />;
}
