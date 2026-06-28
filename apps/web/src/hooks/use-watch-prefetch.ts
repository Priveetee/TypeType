import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "./use-auth";
import { useInstance } from "./use-instance";
import { useSettings } from "./use-settings";
import { streamQueryOptions } from "./use-stream";

const HOVER_DELAY_MS = 220;
const PREFETCH_COOLDOWN_MS = 10 * 1000;
const MAX_IN_FLIGHT_PREFETCH = 2;

const inFlight = new Set<string>();
const prefetchedAt = new Map<string, number>();

export function useWatchPrefetch(videoUrl: string) {
  const queryClient = useQueryClient();
  const { authReady, isAuthed } = useAuth();
  const { data: instance, isPending: instancePending } = useInstance();
  const { settings, settingsReady } = useSettings();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useAuthenticatedStream =
    isAuthed && (settings.accessMode === "allow_list" || instance?.guestAllowed === false);
  const prefetchReady = authReady && !instancePending && (!isAuthed || settingsReady);

  const clearPending = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const onMouseEnter = useCallback(() => {
    clearPending();
    timerRef.current = setTimeout(() => {
      if (!prefetchReady) return;
      const state = queryClient.getQueryState([
        "stream",
        videoUrl,
        useAuthenticatedStream ? "auth" : "anon",
      ]);
      const updatedAt = state?.dataUpdatedAt ?? 0;
      const freshEnough = Date.now() - updatedAt < 3 * 60 * 1000;
      const cooldownOk = Date.now() - (prefetchedAt.get(videoUrl) ?? 0) > PREFETCH_COOLDOWN_MS;
      if (freshEnough || !cooldownOk || inFlight.has(videoUrl)) return;
      if (inFlight.size >= MAX_IN_FLIGHT_PREFETCH) return;
      inFlight.add(videoUrl);
      prefetchedAt.set(videoUrl, Date.now());
      void queryClient
        .prefetchQuery(streamQueryOptions(videoUrl, useAuthenticatedStream))
        .catch(() => undefined)
        .finally(() => inFlight.delete(videoUrl));
    }, HOVER_DELAY_MS);
  }, [clearPending, prefetchReady, queryClient, useAuthenticatedStream, videoUrl]);

  useEffect(() => clearPending, [clearPending]);

  return { onMouseEnter, onMouseLeave: clearPending };
}
