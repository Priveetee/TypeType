import type { BlockedItem, ProgressItem } from "../types/user";
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

export async function fetchProgress(videoUrl: string): Promise<ProgressItem> {
  const res = await authed(`${BASE}/progress/${encodeURIComponent(videoUrl)}`);
  if (res.status === 404) return { videoUrl, position: 0, updatedAt: 0 };
  const body = await res.json();
  if (!res.ok) throw new ApiError((body as { error: string }).error, res.status);
  return body as ProgressItem;
}

export async function updateProgress(videoUrl: string, position: number): Promise<void> {
  const res = await authed(`${BASE}/progress/${encodeURIComponent(videoUrl)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position: Math.round(position) }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "update failed" }));
    throw new ApiError((body as { error: string }).error, res.status);
  }
}

export function fetchBlockedChannels(): Promise<BlockedItem[]> {
  return authedJson(`${BASE}/blocked/channels`);
}

export async function blockChannel(
  url: string,
  name?: string,
  thumbnailUrl?: string,
): Promise<void> {
  await authed(`${BASE}/blocked/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, name, thumbnailUrl }),
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
