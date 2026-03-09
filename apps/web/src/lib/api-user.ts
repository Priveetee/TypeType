import type { HistoryItem, SearchHistoryItem, SettingsItem, SubscriptionItem } from "../types/user";
import { ApiError } from "./api";
import { getToken } from "./token";

const BASE = import.meta.env.VITE_API_URL;

async function authed(url: string, init?: RequestInit): Promise<Response> {
  const token = await getToken();
  return fetch(url, {
    ...init,
    headers: { "X-Instance-Token": token, ...(init?.headers ?? {}) },
  });
}

async function authedJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await authed(url, init);
  const body = await res.json();
  if (!res.ok) throw new ApiError((body as { error: string }).error, res.status);
  return body as T;
}

export function fetchHistory(): Promise<HistoryItem[]> {
  return authedJson(`${BASE}/history`);
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
  await authed(`${BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function unsubscribe(channelUrl: string): Promise<void> {
  await authed(`${BASE}/subscriptions/${encodeURIComponent(channelUrl)}`, { method: "DELETE" });
}

export function fetchSettings(): Promise<SettingsItem> {
  return authedJson(`${BASE}/settings`);
}

export async function updateSettings(settings: SettingsItem): Promise<void> {
  await authed(`${BASE}/settings`, {
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
