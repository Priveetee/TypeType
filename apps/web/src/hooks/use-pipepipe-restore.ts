import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type PipePipeTimeMode, restorePipePipe } from "../lib/api-restore";

const INVALIDATE_KEYS = [
  ["history"],
  ["history-all"],
  ["subscriptions"],
  ["subscription-feed"],
  ["playlists"],
  ["search-history"],
  ["progress"],
] as const;

export function usePipePipeRestore() {
  const qc = useQueryClient();

  const restore = useMutation({
    mutationFn: ({ file, timeMode }: { file: File; timeMode: PipePipeTimeMode }) =>
      restorePipePipe(file, timeMode),
    onSuccess: async () => {
      await Promise.all(
        INVALIDATE_KEYS.map((queryKey) => qc.invalidateQueries({ queryKey: [...queryKey] })),
      );
      await qc.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return { restore };
}
