import { mapVideoItem } from "../lib/mappers";
import type {
  HomeRecommendationsResponse,
  SearchPageResponse,
  SubscriptionFeedPage,
} from "../types/api";
import type { VideoStream } from "../types/stream";

export function isLikelyShort(stream: VideoStream): boolean {
  if (stream.id.includes("/shorts/")) return true;
  if (stream.isShortFormContent) return true;
  const normalizedType = stream.streamType?.toLowerCase() ?? "";
  if (normalizedType.includes("short")) return true;
  return stream.duration === 0 || (stream.duration > 0 && stream.duration <= 180);
}

export function parseNextPage(nextpage: string | null): number | undefined {
  if (nextpage === null) return undefined;
  const parsed = Number(nextpage);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function fromRecommendations(
  pages: HomeRecommendationsResponse[] | undefined,
): VideoStream[] {
  return (pages ?? [])
    .flatMap((page) => page.items)
    .map(mapVideoItem)
    .filter(isLikelyShort);
}

export function fromSubscriptions(pages: SubscriptionFeedPage[] | undefined): VideoStream[] {
  return (pages ?? [])
    .flatMap((page) => page.videos)
    .map(mapVideoItem)
    .filter(isLikelyShort);
}

export function fromDiscovery(pages: SearchPageResponse[] | undefined): VideoStream[] {
  return (pages ?? [])
    .flatMap((page) => page.items)
    .map(mapVideoItem)
    .filter(isLikelyShort);
}

export function dedupeShorts(streams: VideoStream[]): VideoStream[] {
  const seen = new Set<string>();
  return streams.filter((stream) => {
    if (seen.has(stream.id)) return false;
    seen.add(stream.id);
    return true;
  });
}

export function interleaveByChannel(streams: VideoStream[]): VideoStream[] {
  const groups = new Map<string, VideoStream[]>();
  const order: string[] = [];
  for (const stream of streams) {
    const key = stream.channelUrl ?? `__${stream.id}`;
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(stream);
      continue;
    }
    groups.set(key, [stream]);
    order.push(key);
  }

  const out: VideoStream[] = [];
  let progress = true;
  while (progress) {
    progress = false;
    for (const key of order) {
      const bucket = groups.get(key);
      if (!bucket || bucket.length === 0) continue;
      const next = bucket.shift();
      if (!next) continue;
      out.push(next);
      progress = true;
    }
  }
  return out;
}

export function blendRecommendationsWithSubscriptions(
  recommendations: VideoStream[],
  subscriptions: VideoStream[],
): VideoStream[] {
  if (recommendations.length === 0) return subscriptions;

  const recommendationIds = new Set(recommendations.map((stream) => stream.id));
  const subscriptionCandidates = subscriptions.filter(
    (stream) => !recommendationIds.has(stream.id),
  );
  if (subscriptionCandidates.length === 0) return recommendations;

  const insertCount = Math.min(2, subscriptionCandidates.length);
  const blended = [...recommendations];
  for (let i = 0; i < insertCount; i++) {
    const segment = Math.floor(recommendations.length / (insertCount + 1));
    const position = Math.min(blended.length, segment * (i + 1) + i);
    blended.splice(position, 0, subscriptionCandidates[i]);
  }
  return blended;
}
