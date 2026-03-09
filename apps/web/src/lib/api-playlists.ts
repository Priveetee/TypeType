import type { PlaylistItem, PlaylistVideoItem } from "../types/user";
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

export function fetchPlaylists(): Promise<PlaylistItem[]> {
  return authedJson(`${BASE}/playlists`);
}

export function fetchPlaylist(id: string): Promise<PlaylistItem> {
  return authedJson(`${BASE}/playlists/${encodeURIComponent(id)}`);
}

export async function createPlaylist(name: string, description = ""): Promise<PlaylistItem> {
  return authedJson(`${BASE}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
}

export async function updatePlaylist(
  id: string,
  patch: { name?: string; description?: string },
): Promise<void> {
  await authed(`${BASE}/playlists/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export async function deletePlaylist(id: string): Promise<void> {
  await authed(`${BASE}/playlists/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function addVideoToPlaylist(
  playlistId: string,
  video: { url: string; title: string; thumbnail: string; duration: number },
): Promise<PlaylistVideoItem> {
  return authedJson(`${BASE}/playlists/${encodeURIComponent(playlistId)}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
}

export async function removeVideoFromPlaylist(playlistId: string, videoUrl: string): Promise<void> {
  await authed(
    `${BASE}/playlists/${encodeURIComponent(playlistId)}/videos/${encodeURIComponent(videoUrl)}`,
    { method: "DELETE" },
  );
}
