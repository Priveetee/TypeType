import { useAuthStore } from "../stores/auth-store";
import { useRecommendationTrackingStore } from "../stores/recommendation-tracking-store";
import type { VideoStream } from "../types/stream";
import { API_BASE as BASE } from "./env";

type RecommendationEventType = "impression" | "click" | "watch";
type RecommendationFeedbackType = "not_interested" | "less_from_channel";
type EventOptions = { watchRatio?: number };

const sentEvents = new Set<string>();
const sentFeedback = new Set<string>();

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

function eventKey(type: RecommendationEventType, videoUrl: string): string {
  return `${type}:${videoUrl}`;
}

export function trackRecommendationEvent(
  type: RecommendationEventType,
  stream: Pick<VideoStream, "id" | "channelUrl" | "title">,
  opts?: EventOptions,
) {
  if (type !== "watch") {
    const key = eventKey(type, stream.id);
    if (sentEvents.has(key)) return;
    sentEvents.add(key);
  }

  post("/recommendations/events", {
    eventType: type,
    videoUrl: stream.id,
    uploaderUrl: stream.channelUrl ?? null,
    title: stream.title,
    watchRatio: opts?.watchRatio ?? null,
    occurredAt: Date.now(),
  });
}

export function sendRecommendationFeedback(
  type: RecommendationFeedbackType,
  stream: Pick<VideoStream, "id" | "channelUrl">,
) {
  const key = `${type}:${stream.id}:${stream.channelUrl ?? ""}`;
  if (sentFeedback.has(key)) return;
  sentFeedback.add(key);

  post("/recommendations/feedback", {
    feedbackType: type,
    videoUrl: stream.id,
    uploaderUrl: stream.channelUrl ?? null,
  });
}
