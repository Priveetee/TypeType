import { useEffect, useRef } from "react";
import { buildChaptersVtt } from "../lib/chapters-vtt";
import { proxyUrl } from "../lib/proxy";
import { trackRecommendationEvent } from "../lib/recommendation-tracker";
import { buildThumbnailVtt } from "../lib/thumbnail-vtt";
import type { VideoStream } from "../types/stream";

export function useWatchVttAssets(stream: VideoStream) {
  const thumbnailVtt = useRef<string | null>(null);
  const chaptersVtt = useRef<string | null>(null);

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

  return {
    thumbnailVtt: thumbnailVtt.current ?? undefined,
    chaptersVtt: chaptersVtt.current ?? undefined,
  };
}

export function useWatchRecommendationTracking(
  stream: VideoStream,
  isLive: boolean,
  positionRef: React.RefObject<number>,
) {
  const watchSentRef = useRef(false);
  const trackedStreamIdRef = useRef("");

  if (trackedStreamIdRef.current !== stream.id) {
    trackedStreamIdRef.current = stream.id;
    watchSentRef.current = false;
  }

  useEffect(() => {
    if (isLive || stream.duration <= 0 || watchSentRef.current) return;
    const onBeforeUnload = () => {
      const ratio = Math.max(0, Math.min((positionRef.current ?? 0) / (stream.duration * 1000), 1));
      if (ratio < 0.2 || watchSentRef.current) return;
      watchSentRef.current = true;
      trackRecommendationEvent("watch", stream, { watchRatio: ratio });
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isLive, stream, positionRef]);
}
