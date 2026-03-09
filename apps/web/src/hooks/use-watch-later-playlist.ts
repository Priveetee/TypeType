import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { createPlaylist } from "../lib/api-playlists";
import type { PlaylistItem } from "../types/user";
import { usePlaylists } from "./use-playlists";

const KEY = ["playlists"];
const WATCH_LATER_NAME = "Watch Later";

type AddPayload = {
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
};

type Intent = { url: string; adding: boolean };

export function useWatchLaterPlaylist() {
  const { query, addVideo, removeVideo } = usePlaylists();
  const qc = useQueryClient();
  const intentRef = useRef<Intent | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);

  const playlists = query.data ?? [];
  const watchLaterPlaylist = playlists.find((p) => p.name === WATCH_LATER_NAME);

  function isInWatchLater(videoUrl: string): boolean {
    if (intentRef.current?.url === videoUrl) return intentRef.current.adding;
    return watchLaterPlaylist?.videos.some((v) => v.url === videoUrl) ?? false;
  }

  function applyIntent(value: Intent | null) {
    intentRef.current = value;
    setIntent(value);
  }

  async function ensurePlaylist(): Promise<string> {
    if (watchLaterPlaylist) return watchLaterPlaylist.id;
    const created = await createPlaylist(WATCH_LATER_NAME);
    qc.setQueryData<PlaylistItem[]>(KEY, (old) => [...(old ?? []), created]);
    return created.id;
  }

  async function add(payload: AddPayload): Promise<void> {
    if (isInWatchLater(payload.url)) return;
    applyIntent({ url: payload.url, adding: true });
    try {
      const playlistId = await ensurePlaylist();
      await addVideo.mutateAsync({ playlistId, video: payload });
    } catch (e) {
      applyIntent(null);
      throw e;
    }
    applyIntent(null);
  }

  async function remove(videoUrl: string): Promise<void> {
    if (!watchLaterPlaylist) return;
    applyIntent({ url: videoUrl, adding: false });
    try {
      await removeVideo.mutateAsync({ playlistId: watchLaterPlaylist.id, videoUrl });
    } catch (e) {
      applyIntent(null);
      throw e;
    }
    applyIntent(null);
  }

  return { isInWatchLater, add, remove, isPending: intent !== null };
}
