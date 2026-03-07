import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgress } from "../lib/api-collections";

export function useProgress() {
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: ({ videoUrl, position }: { videoUrl: string; position: number }) =>
      updateProgress(videoUrl, position),
    onSuccess: (_data, { videoUrl }) => qc.invalidateQueries({ queryKey: ["progress", videoUrl] }),
  });

  return { save };
}
