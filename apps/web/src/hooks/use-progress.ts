import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProgress, updateProgress } from "../lib/api-collections";
import { useAuth } from "./use-auth";

export function useProgress(videoUrl: string) {
  const { isAuthed } = useAuth();
  return useQuery({
    queryKey: ["progress", videoUrl],
    queryFn: () =>
      isAuthed ? fetchProgress(videoUrl) : Promise.resolve({ videoUrl, position: 0, updatedAt: 0 }),
    retry: false,
    staleTime: Infinity,
    enabled: videoUrl.length > 0,
  });
}

export function useSaveProgress(videoUrl: string) {
  const { isAuthed } = useAuth();
  return useMutation({
    mutationFn: (position: number) =>
      isAuthed ? updateProgress(videoUrl, position) : Promise.resolve(),
  });
}
