import type { MediaSrc } from "@vidstack/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSaveProgress } from "../hooks/use-progress";
import { buildDashManifest } from "../lib/dash-manifest";
import { proxyUrl } from "../lib/proxy";
import { buildThumbnailVtt } from "../lib/thumbnail-vtt";
import type { VideoStream } from "../types/stream";
import { RelatedVideos } from "./related-videos";
import { VideoPlayer } from "./video-player";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

const BASE = import.meta.env.VITE_API_URL;

function fallbackSrc(stream: VideoStream): MediaSrc {
  if (stream.videoOnlyStreams?.length && stream.audioStreams?.length) {
    const built = buildDashManifest(stream.videoOnlyStreams, stream.audioStreams, stream.duration);
    if (built) return { src: built, type: "application/dash+xml" };
  }
  return {
    src: `${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`,
    type: "application/dash+xml",
  };
}

type Props = {
  stream: VideoStream;
  startTime: number;
};

export function WatchLayout({ stream, startTime }: Props) {
  const save = useSaveProgress(stream.id);
  const isLive = stream.livestream;
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length);
  const [nativeFailed, setNativeFailed] = useState(false);

  let manifestSrc: MediaSrc;
  if (isLive && stream.hlsUrl) {
    manifestSrc = { src: proxyUrl(stream.hlsUrl), type: "application/x-mpegurl" };
  } else if (nativeEnabled && !nativeFailed) {
    manifestSrc = {
      src: `${BASE}/streams/native-manifest?url=${encodeURIComponent(stream.id)}`,
      type: "application/dash+xml",
    };
  } else {
    manifestSrc = fallbackSrc(stream);
  }

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) setNativeFailed(true);
  }, [nativeEnabled, nativeFailed]);

  const positionRef = useRef(0);
  const thumbnailVtt = useRef<string | null>(null);
  const saveMutateRef = useRef(save.mutate);
  saveMutateRef.current = save.mutate;

  const saveIfEligibleRef = useRef<() => void>(() => {});
  saveIfEligibleRef.current = () => {
    const pos = positionRef.current;
    if (pos < 5000) return;
    const durationMs = stream.duration * 1000;
    if (pos >= durationMs * 0.95) return;
    saveMutateRef.current(pos);
  };

  const handleSave = useCallback(() => saveIfEligibleRef.current(), []);

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

  const handleTimeUpdate = useCallback((positionMs: number) => {
    positionRef.current = positionMs;
  }, []);

  useEffect(() => {
    if (stream.livestream) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveIfEligibleRef.current();
    };
    const interval = setInterval(() => saveIfEligibleRef.current(), 10_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [stream.livestream]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex-[2] min-w-0 max-w-[133.333vh] flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden">
          <VideoPlayer
            src={manifestSrc}
            title={stream.title}
            poster={stream.thumbnail}
            streamType={stream.livestream ? "live" : "on-demand"}
            startTime={startTime}
            subtitles={stream.subtitles}
            sponsorBlockSegments={stream.sponsorBlockSegments}
            thumbnailVtt={thumbnailVtt.current ?? undefined}
            onTimeUpdate={handleTimeUpdate}
            onPause={handleSave}
            onSeeked={handleSave}
            onError={handleError}
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
