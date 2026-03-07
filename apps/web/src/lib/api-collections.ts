import type { BlockedItem, LikeItem, ProgressItem, WatchLaterItem } from "../types/user";
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

export function fetchWatchLater(): Promise<WatchLaterItem[]> {
  return authedJson(`${BASE}/watch-later`);
}

export async function addWatchLater(item: Omit<WatchLaterItem, "addedAt">): Promise<void> {
  await authed(`${BASE}/watch-later`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function removeWatchLater(videoUrl: string): Promise<void> {
  await authed(`${BASE}/watch-later/${encodeURIComponent(videoUrl)}`, { method: "DELETE" });
}

export function fetchProgress(videoUrl: string): Promise<ProgressItem> {
  return authedJson(`${BASE}/progress/${encodeURIComponent(videoUrl)}`);
}

export async function updateProgress(videoUrl: string, position: number): Promise<void> {
  await authed(`${BASE}/progress/${encodeURIComponent(videoUrl)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position }),
  });
}

export function fetchLikes(): Promise<LikeItem[]> {
  return authedJson(`${BASE}/likes`);
}

export async function addLike(videoUrl: string): Promise<void> {
  await authed(`${BASE}/likes/${encodeURIComponent(videoUrl)}`, { method: "POST" });
}

export async function removeLike(videoUrl: string): Promise<void> {
  await authed(`${BASE}/likes/${encodeURIComponent(videoUrl)}`, { method: "DELETE" });
}

export function fetchBlockedChannels(): Promise<BlockedItem[]> {
  return authedJson(`${BASE}/blocked/channels`);
}

export async function blockChannel(url: string): Promise<void> {
  await authed(`${BASE}/blocked/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export async function unblockChannel(url: string): Promise<void> {
  await authed(`${BASE}/blocked/channels/${encodeURIComponent(url)}`, { method: "DELETE" });
}

export function fetchBlockedVideos(): Promise<BlockedItem[]> {
  return authedJson(`${BASE}/blocked/videos`);
}

export async function blockVideo(url: string): Promise<void> {
  await authed(`${BASE}/blocked/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export async function unblockVideo(url: string): Promise<void> {
  await authed(`${BASE}/blocked/videos/${encodeURIComponent(url)}`, { method: "DELETE" });
}
