import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWatchLater, fetchWatchLater, removeWatchLater } from "../lib/api-collections";
import type { WatchLaterItem } from "../types/user";

const KEY = ["watch-later"];

export function useWatchLater() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchWatchLater });

  const add = useMutation({
    mutationFn: (item: Omit<WatchLaterItem, "addedAt">) => addWatchLater(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (videoUrl: string) => removeWatchLater(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, add, remove };
}
