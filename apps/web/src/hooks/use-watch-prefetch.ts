import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { streamQueryOptions } from "./use-stream";

const HOVER_DELAY_MS = 220;
const PREFETCH_COOLDOWN_MS = 10 * 1000;
const MAX_IN_FLIGHT_PREFETCH = 2;

const inFlight = new Set<string>();
const prefetchedAt = new Map<string, number>();

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
      const state = queryClient.getQueryState(["stream", videoUrl]);
      const updatedAt = state?.dataUpdatedAt ?? 0;
      const freshEnough = Date.now() - updatedAt < 3 * 60 * 1000;
      const cooldownOk = Date.now() - (prefetchedAt.get(videoUrl) ?? 0) > PREFETCH_COOLDOWN_MS;
      if (freshEnough || !cooldownOk || inFlight.has(videoUrl)) return;
      if (inFlight.size >= MAX_IN_FLIGHT_PREFETCH) return;
      inFlight.add(videoUrl);
      prefetchedAt.set(videoUrl, Date.now());
      void queryClient
        .prefetchQuery(streamQueryOptions(videoUrl))
        .catch(() => undefined)
        .finally(() => inFlight.delete(videoUrl));
    }, HOVER_DELAY_MS);
  }, [clearPending, queryClient, videoUrl]);

  useEffect(() => clearPending, [clearPending]);

  return { onMouseEnter, onMouseLeave: clearPending };
}
