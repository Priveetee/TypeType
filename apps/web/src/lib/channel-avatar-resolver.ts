import { fetchChannel } from "./api";
import { proxyImage } from "./proxy";

const CACHE_MS = 30 * 60 * 1000;

type CacheEntry = {
  avatarUrl: string;
  updatedAt: number;
};

const avatarCache = new Map<string, CacheEntry>();
const pendingByChannel = new Map<string, Promise<string | null>>();

function readCache(channelUrl: string): string | null {
  const entry = avatarCache.get(channelUrl);
  if (!entry) return null;
  if (Date.now() - entry.updatedAt > CACHE_MS) {
    avatarCache.delete(channelUrl);
    return null;
  }
  return entry.avatarUrl;
}

function writeCache(channelUrl: string, avatarUrl: string): void {
  avatarCache.set(channelUrl, { avatarUrl, updatedAt: Date.now() });
}

export async function resolveChannelAvatar(channelUrl: string): Promise<string | null> {
  if (!channelUrl.startsWith("http://") && !channelUrl.startsWith("https://")) return null;
  const cached = readCache(channelUrl);
  if (cached) return cached;

  const pending = pendingByChannel.get(channelUrl);
  if (pending) return pending;

  const task = (async () => {
    try {
      const channel = await fetchChannel(channelUrl);
      const raw = channel.avatarUrl.trim();
      if (!raw) return null;
      const proxied = proxyImage(raw);
      writeCache(channelUrl, proxied);
      return proxied;
    } catch {
      return null;
    } finally {
      pendingByChannel.delete(channelUrl);
    }
  })();

  pendingByChannel.set(channelUrl, task);
  return task;
}
