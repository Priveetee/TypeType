import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBulletComments } from "../hooks/use-bullet-comments";
import { useSaveProgress } from "../hooks/use-progress";
import { useSettings } from "../hooks/use-settings";
import { useVolumeSync } from "../hooks/use-volume-sync";
import { buildChaptersVtt } from "../lib/chapters-vtt";
import { detectProvider } from "../lib/provider";
import { proxyUrl } from "../lib/proxy";
import { resolveManifestSrc } from "../lib/stream-src";
import { buildThumbnailVtt } from "../lib/thumbnail-vtt";
import { useDanmakuStore } from "../stores/danmaku-store";
import type { VideoStream } from "../types/stream";
import { DanmakuOverlay } from "./danmaku-overlay";
import { PlayerDefaults } from "./player-internals";
import { RelatedVideos } from "./related-videos";
import { VideoPlayer } from "./video-player";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

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
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length);
  const [nativeFailed, setNativeFailed] = useState(false);
  const { on: bulletCommentsOn } = useDanmakuStore();
  const isNicoNico = detectProvider(stream.id) === "nicovideo";
  const { data: bulletComments } = useBulletComments(stream.id, isNicoNico);
  const originalLocale =
    stream.audioStreams?.find((a) => a.audioTrackName?.toLowerCase().includes("original"))
      ?.audioLocale ?? null;

  const manifestSrc = resolveManifestSrc(stream, isLive, nativeFailed);

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) setNativeFailed(true);
  }, [nativeEnabled, nativeFailed]);

  const positionRef = useRef(0);
  const seekRef = useRef<((seconds: number) => void) | null>(null);
  const thumbnailVtt = useRef<string | null>(null);
  const chaptersVtt = useRef<string | null>(null);
  const saveMutateRef = useRef(save.mutate);
  saveMutateRef.current = save.mutate;
  const handleVolumeChange = useVolumeSync(update.mutate);

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

  useEffect(() => {
    if (!stream.previewFrames) {
      thumbnailVtt.current = null;
      return;
    }
    const proxied = stream.previewFrames.map((frame) => ({
      ...frame,
      urls: frame.urls.map(proxyUrl),
    }));
    thumbnailVtt.current = buildThumbnailVtt(proxied);
    return () => {
      if (thumbnailVtt.current) URL.revokeObjectURL(thumbnailVtt.current);
    };
  }, [stream.previewFrames]);

  useEffect(() => {
    chaptersVtt.current = stream.streamSegments
      ? buildChaptersVtt(stream.streamSegments, stream.duration)
      : null;
    return () => {
      if (chaptersVtt.current) URL.revokeObjectURL(chaptersVtt.current);
    };
  }, [stream.streamSegments, stream.duration]);

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

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex-[2] min-w-0 max-w-[133.333vh] flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden">
          <VideoPlayer
            src={manifestSrc}
            title={stream.title}
            poster={stream.thumbnail}
            streamType={isLive ? "live" : "on-demand"}
            startTime={startTime}
            subtitles={stream.subtitles}
            sponsorBlockSegments={stream.sponsorBlockSegments}
            thumbnailVtt={thumbnailVtt.current ?? undefined}
            chaptersVtt={chaptersVtt.current ?? undefined}
            initialVolume={settings.volume}
            initialMuted={settings.muted}
            settingsReady={settingsReady}
            autoplay={settingsReady && settings.autoplay}
            originalAudioLocale={originalLocale}
            overlay={
              <>
                {isNicoNico && bulletCommentsOn && bulletComments && (
                  <DanmakuOverlay comments={bulletComments} positionRef={positionRef} />
                )}
                <PlayerDefaults
                  defaultQuality={settings.defaultQuality}
                  defaultAudioLanguage={settings.defaultAudioLanguage || undefined}
                  subtitlesEnabled={settings.subtitlesEnabled}
                  defaultSubtitleLanguage={settings.defaultSubtitleLanguage || undefined}
                />
              </>
            }
            onVolumeChange={handleVolumeChange}
            onTimeUpdate={handleTimeUpdate}
            onPause={handleSave}
            onSeeked={handleSeekSave}
            onError={handleError}
            onEnded={handleEnded}
            onSeekReady={(seek) => {
              seekRef.current = seek;
            }}
          />
        </div>
        <WatchInfo stream={stream} />
        <WatchActions stream={stream} />
        {stream.description && <WatchDescription description={stream.description} />}
        <WatchComments videoUrl={stream.id} />
      </div>
      <div className="w-full lg:flex-1 lg:min-w-64">
        <RelatedVideos streams={stream.related ?? []} />
      </div>
    </div>
  );
}
