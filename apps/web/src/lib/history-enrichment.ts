import type { StreamResponse } from "../types/api";
import type { HistoryItem } from "../types/user";
import { fetchStream } from "./api";

const CACHE_MS = 30 * 60 * 1000;

type CacheEntry = {
  updatedAt: number;
  avatarUrl: string;
};

const avatarCache = new Map<string, CacheEntry>();
const pendingByChannel = new Map<string, Promise<string | null>>();

function fromStream(stream: StreamResponse): string | null {
  return stream.uploaderAvatarUrl && stream.uploaderAvatarUrl.length > 0
    ? stream.uploaderAvatarUrl
    : null;
}

function cached(channelUrl: string): string | null {
  const hit = avatarCache.get(channelUrl);
  if (!hit) return null;
  if (Date.now() - hit.updatedAt > CACHE_MS) {
    avatarCache.delete(channelUrl);
    return null;
  }
  return hit.avatarUrl;
}

function setCache(channelUrl: string, avatarUrl: string): void {
  avatarCache.set(channelUrl, { avatarUrl, updatedAt: Date.now() });
}

export async function resolveHistoryAvatar(item: HistoryItem): Promise<string | null> {
  if (item.channelAvatar) return item.channelAvatar;
  const channelUrl = item.channelUrl;
  if (!channelUrl) return null;
  const hit = cached(channelUrl);
  if (hit) return hit;
  const pending = pendingByChannel.get(channelUrl);
  if (pending) return pending;
  const task = (async () => {
    try {
      const stream = await fetchStream(item.url);
      const avatarUrl = fromStream(stream);
      if (!avatarUrl) return null;
      setCache(channelUrl, avatarUrl);
      return avatarUrl;
    } catch {
      return null;
    } finally {
      pendingByChannel.delete(channelUrl);
    }
  })();
  pendingByChannel.set(channelUrl, task);
  return task;
}
