import { useRecommendationTrackingStore } from "../stores/recommendation-tracking-store";
import type { VideoStream } from "../types/stream";
import { trackRecommendationEvent, trackShortSkip } from "./recommendation-tracker";

export type ShortsIntent = "quick" | "auto" | "deep";

type WatchStats = {
  watchDurationMs: number;
  watchRatio: number | undefined;
};

function getWatchStats(stream: VideoStream, enteredAtMs: number): WatchStats {
  const watchDurationMs = Math.max(0, Date.now() - enteredAtMs);
  const durationMs = stream.duration > 0 ? stream.duration * 1000 : 0;
  const watchRatio = durationMs > 0 ? Math.min(1, watchDurationMs / durationMs) : undefined;
  return { watchDurationMs, watchRatio };
}

export function trackShortsUserMove(
  stream: VideoStream,
  enteredAtMs: number,
  serviceId: number,
  intent: ShortsIntent,
) {
  if (!useRecommendationTrackingStore.getState().enabled) return;
  const { watchDurationMs, watchRatio } = getWatchStats(stream, enteredAtMs);
  if (watchRatio !== undefined && watchRatio >= 0.7) {
    trackRecommendationEvent("watch", stream, {
      watchRatio,
      watchDurationMs,
      serviceId,
      intent,
    });
    return;
  }
  trackShortSkip(stream, watchDurationMs, { serviceId, intent });
}

export function trackShortsAutoAdvance(
  stream: VideoStream,
  enteredAtMs: number,
  serviceId: number,
  intent: ShortsIntent,
) {
  if (!useRecommendationTrackingStore.getState().enabled) return;
  const { watchDurationMs, watchRatio } = getWatchStats(stream, enteredAtMs);
  if (watchRatio === undefined || watchRatio < 0.85) return;
  trackRecommendationEvent("watch", stream, {
    watchRatio,
    watchDurationMs,
    serviceId,
    intent,
  });
}
