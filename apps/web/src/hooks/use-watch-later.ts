import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWatchLater, fetchWatchLater, removeWatchLater } from "../lib/api-collections";
import type { WatchLaterItem } from "../types/user";

const KEY = ["watch-later"];

type AddPayload = {
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
};

export function useWatchLater() {
  const qc = useQueryClient();
  const query = useQuery<WatchLaterItem[]>({ queryKey: KEY, queryFn: fetchWatchLater });
  const videos = query.data ?? [];

  const add = useMutation({
    mutationFn: (video: AddPayload) => addWatchLater(video),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (videoUrl: string) => removeWatchLater(videoUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { videos, add, remove };
}
