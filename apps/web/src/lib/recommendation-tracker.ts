import { useAuthStore } from "../stores/auth-store";
import { useRecommendationTrackingStore } from "../stores/recommendation-tracking-store";
import type { VideoStream } from "../types/stream";
import { API_BASE as BASE } from "./env";

type RecommendationEventType = "impression" | "click" | "watch" | "favorite" | "watch_later_add";
type RecommendationFeedbackType = "not_interested" | "less_from_channel";
type RecommendationEventTypeAll = RecommendationEventType | "short_skip";
type EventOptions = {
  watchRatio?: number;
  watchDurationMs?: number;
  serviceId?: number;
  intent?: "quick" | "auto" | "deep";
};

const sentEvents = new Set<string>();
const sentFeedback = new Set<string>();
const lastEventPayloads: Record<string, unknown>[] = [];
const lastFeedbackPayloads: Record<string, unknown>[] = [];

function keepRecent(
  bucket: Record<string, unknown>[],
  payload: Record<string, unknown>,
  max: number,
) {
  bucket.push(payload);
  if (bucket.length > max) bucket.splice(0, bucket.length - max);
}

function trackingEnabled(): boolean {
  return useRecommendationTrackingStore.getState().enabled;
}

function post(path: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!trackingEnabled()) return;
  const token = useAuthStore.getState().token;
  if (!token) return;
  void fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    return;
  });
}

function eventKey(type: RecommendationEventTypeAll, videoUrl: string): string {
  return `${type}:${videoUrl}`;
}

export function trackRecommendationEvent(
  type: RecommendationEventTypeAll,
  stream: Pick<VideoStream, "id" | "channelUrl" | "title">,
  opts?: EventOptions,
) {
  if (type !== "watch") {
    const key = eventKey(type, stream.id);
    if (sentEvents.has(key)) return;
    sentEvents.add(key);
  }

  const payload = {
    eventType: type,
    videoUrl: stream.id,
    uploaderUrl: stream.channelUrl ?? null,
    title: stream.title,
    watchRatio: opts?.watchRatio ?? null,
    watchDurationMs: opts?.watchDurationMs ?? null,
    serviceId: opts?.serviceId ?? null,
    intent: opts?.intent ?? null,
    occurredAt: Date.now(),
  };
  keepRecent(lastEventPayloads, payload, 10);
  post("/recommendations/events", payload);
}

export function trackShortSkip(
  stream: Pick<VideoStream, "id" | "channelUrl" | "title">,
  watchDurationMs: number,
  opts?: Pick<EventOptions, "serviceId" | "intent">,
) {
  trackRecommendationEvent("short_skip", stream, {
    watchDurationMs,
    serviceId: opts?.serviceId,
    intent: opts?.intent,
  });
}

export function sendRecommendationFeedback(
  type: RecommendationFeedbackType,
  stream: Pick<VideoStream, "id" | "channelUrl">,
) {
  const key = `${type}:${stream.id}:${stream.channelUrl ?? ""}`;
  if (sentFeedback.has(key)) return;
  sentFeedback.add(key);

  const payload = {
    feedbackType: type,
    videoUrl: stream.id,
    uploaderUrl: stream.channelUrl ?? null,
  };
  keepRecent(lastFeedbackPayloads, payload, 5);
  post("/recommendations/feedback", payload);
}

export function getRecommendationDebugSnapshot() {
  return {
    lastEvents: [...lastEventPayloads],
    lastFeedback: [...lastFeedbackPayloads],
  };
}
