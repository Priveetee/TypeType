import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, fetchFavorites, removeFavorite } from "../lib/api-collections";

const KEY = ["favorites"];

export function useFavorites() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchFavorites });

  const add = useMutation({
    mutationFn: (videoUrl: string) => addFavorite(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (videoUrl: string) => removeFavorite(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function isFavorited(videoUrl: string): boolean {
    return (query.data ?? []).some((f) => f.videoUrl === videoUrl);
  }

  return { query, add, remove, isFavorited };
}
