import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Playlist } from "../types/playlist";
import type { VideoStream } from "../types/stream";

type PlaylistStore = {
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, stream: VideoStream) => void;
  removeFromPlaylist: (playlistId: string, streamId: string) => void;
  isInPlaylist: (playlistId: string, streamId: string) => boolean;
};

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],
      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            { id: crypto.randomUUID(), name, streams: [], createdAt: new Date() },
          ],
        })),
      deletePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        })),
      addToPlaylist: (playlistId, stream) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId && !p.streams.some((s) => s.id === stream.id)
              ? { ...p, streams: [...p.streams, stream] }
              : p,
          ),
        })),
      removeFromPlaylist: (playlistId, streamId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, streams: p.streams.filter((s) => s.id !== streamId) } : p,
          ),
        })),
      isInPlaylist: (playlistId, streamId) => {
        const playlist = get().playlists.find((p) => p.id === playlistId);
        return playlist?.streams.some((s) => s.id === streamId) ?? false;
      },
    }),
    { name: "typed-playlists" },
  ),
);
