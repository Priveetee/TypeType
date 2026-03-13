import type { VideoItem } from "../types/api";
import type { HistoryItem, SearchHistoryItem, SettingsItem, SubscriptionItem } from "../types/user";
import { ApiError } from "./api";
import { authed, authedJson } from "./authed";

import { API_BASE as BASE } from "./env";

type HistoryParams = {
  q?: string;
  limit?: number;
  offset?: number;
};

type HistoryPage = {
  items: HistoryItem[];
  total: number;
};

export async function fetchHistory(params: HistoryParams = {}): Promise<HistoryPage> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.offset !== undefined) search.set("offset", String(params.offset));
  const qs = search.toString();
  const res = await authed(`${BASE}/history${qs ? `?${qs}` : ""}`);
  const body = await res.json();
  if (!res.ok) throw new ApiError((body as { error: string }).error, res.status);
  const total = Number(res.headers.get("X-Total-Count") ?? 0);
  return { items: body as HistoryItem[], total };
}

export async function addHistory(item: Omit<HistoryItem, "id" | "watchedAt">): Promise<void> {
  await authed(`${BASE}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function removeHistory(id: string): Promise<void> {
  await authed(`${BASE}/history/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function clearHistory(): Promise<void> {
  await authed(`${BASE}/history`, { method: "DELETE" });
}

export function fetchSubscriptions(): Promise<SubscriptionItem[]> {
  return authedJson(`${BASE}/subscriptions`);
}

export async function subscribe(item: Omit<SubscriptionItem, "subscribedAt">): Promise<void> {
  const res = await authed(`${BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "subscribe failed" }));
    throw new ApiError((body as { error: string }).error, res.status);
  }
}

export async function unsubscribe(channelUrl: string): Promise<void> {
  const res = await authed(`${BASE}/subscriptions/${encodeURIComponent(channelUrl)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) {
    const body = await res.json().catch(() => ({ error: "unsubscribe failed" }));
    throw new ApiError((body as { error: string }).error, res.status);
  }
}

export function fetchSettings(): Promise<SettingsItem> {
  return authedJson(`${BASE}/settings`);
}

export function updateSettings(settings: SettingsItem): Promise<SettingsItem> {
  return authedJson(`${BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export function fetchSearchHistory(): Promise<SearchHistoryItem[]> {
  return authedJson(`${BASE}/search-history`);
}

export async function addSearchHistory(term: string): Promise<SearchHistoryItem> {
  return authedJson(`${BASE}/search-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ term }),
  });
}

export async function clearSearchHistory(): Promise<void> {
  await authed(`${BASE}/search-history`, { method: "DELETE" });
}

type SubscriptionFeedPage = {
  videos: VideoItem[];
  nextpage: string | null;
};

export async function fetchSubscriptionFeed(page: number): Promise<SubscriptionFeedPage> {
  const search = new URLSearchParams({ page: String(page), limit: "30" });
  return authedJson(`${BASE}/subscriptions/feed?${search.toString()}`);
}
