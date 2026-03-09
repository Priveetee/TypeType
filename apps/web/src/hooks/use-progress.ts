import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProgress, updateProgress } from "../lib/api-collections";

export function useProgress(videoUrl: string) {
  return useQuery({
    queryKey: ["progress", videoUrl],
    queryFn: () => fetchProgress(videoUrl),
    retry: false,
    staleTime: Infinity,
    enabled: videoUrl.length > 0,
  });
}

export function useSaveProgress(videoUrl: string) {
  return useMutation({
    mutationFn: (position: number) => updateProgress(videoUrl, position),
  });
}
