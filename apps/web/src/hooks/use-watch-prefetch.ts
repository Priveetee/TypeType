import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { streamQueryOptions } from "./use-stream";

const HOVER_DELAY_MS = 220;

export function useWatchPrefetch(videoUrl: string) {
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const onMouseEnter = useCallback(() => {
    clearPending();
    timerRef.current = setTimeout(() => {
      void queryClient.prefetchQuery(streamQueryOptions(videoUrl));
    }, HOVER_DELAY_MS);
  }, [clearPending, queryClient, videoUrl]);

  useEffect(() => clearPending, [clearPending]);

  return { onMouseEnter, onMouseLeave: clearPending };
}
