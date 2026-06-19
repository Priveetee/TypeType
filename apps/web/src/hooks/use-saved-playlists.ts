import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSavedPlaylist,
  fetchSavedPlaylists,
  savePublicPlaylist,
} from "../lib/api-saved-playlists";
import { playlistListId } from "../lib/playlist-url";
import type { SavedPlaylistItem } from "../types/playlist";
import { useAuth } from "./use-auth";

const KEY = ["saved-playlists"];

function samePlaylist(item: SavedPlaylistItem, url: string): boolean {
  const listId = playlistListId(url) ?? url;
  return (
    item.url === url || item.publicPlaylistId === listId || playlistListId(item.url) === listId
  );
}

export function useSavedPlaylists() {
  const qc = useQueryClient();
  const { authReady, isAuthed } = useAuth();
  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchSavedPlaylists,
    enabled: authReady && isAuthed,
  });
  const save = useMutation({
    mutationFn: savePublicPlaylist,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
  const remove = useMutation({
    mutationFn: deleteSavedPlaylist,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
  const items = query.data ?? [];

  return {
    query,
    items,
    save,
    remove,
    findSaved: (url: string) => items.find((item) => samePlaylist(item, url)),
  };
}
