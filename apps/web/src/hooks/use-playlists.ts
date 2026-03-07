import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  fetchPlaylists,
  removeVideoFromPlaylist,
} from "../lib/api-playlists";
import type { PlaylistVideoItem } from "../types/user";

const KEY = ["playlists"];

type AddVideoPayload = {
  playlistId: string;
  video: Omit<PlaylistVideoItem, "id" | "position">;
};

type RemoveVideoPayload = {
  playlistId: string;
  videoUrl: string;
};

export function usePlaylists() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchPlaylists });

  const create = useMutation({
    mutationFn: (name: string) => createPlaylist(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlaylist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const addVideo = useMutation({
    mutationFn: ({ playlistId, video }: AddVideoPayload) => addVideoToPlaylist(playlistId, video),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const removeVideo = useMutation({
    mutationFn: ({ playlistId, videoUrl }: RemoveVideoPayload) =>
      removeVideoFromPlaylist(playlistId, videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function isInPlaylist(playlistId: string, videoUrl: string): boolean {
    const pl = (query.data ?? []).find((p) => p.id === playlistId);
    return pl?.videos.some((v) => v.url === videoUrl) ?? false;
  }

  return { query, create, remove, addVideo, removeVideo, isInPlaylist };
}
