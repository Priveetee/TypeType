import type { SavedPlaylistItem } from "../types/playlist";
import { ApiError } from "./api";
import { authed, authedJson } from "./authed";
import { API_BASE as BASE } from "./env";

export function fetchSavedPlaylists(): Promise<SavedPlaylistItem[]> {
  return authedJson(`${BASE}/saved-playlists`);
}

export function savePublicPlaylist(url: string): Promise<SavedPlaylistItem> {
  return authedJson(`${BASE}/saved-playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export async function deleteSavedPlaylist(id: string): Promise<void> {
  const res = await authed(`${BASE}/saved-playlists/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) {
    const body = await res.json().catch(() => ({ error: "delete failed" }));
    throw new ApiError((body as { error: string }).error, res.status);
  }
}
