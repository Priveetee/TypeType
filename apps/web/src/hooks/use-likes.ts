import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLike, fetchLikes, removeLike } from "../lib/api-collections";

const KEY = ["likes"];

export function useLikes() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchLikes });

  const add = useMutation({
    mutationFn: (videoUrl: string) => addLike(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (videoUrl: string) => removeLike(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function isLiked(videoUrl: string): boolean {
    return (query.data ?? []).some((l) => l.videoUrl === videoUrl);
  }

  return { query, add, remove, isLiked };
}
