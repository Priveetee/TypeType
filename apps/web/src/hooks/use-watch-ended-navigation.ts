import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import type { VideoStream } from "../types/stream";

type Params = {
  settingsReady: boolean;
  autoplay: boolean;
  hideRelatedVideos: boolean;
  nextParam: string | null;
  list?: string;
  shuffle?: string;
  related?: VideoStream[];
};

export function useWatchEndedNavigation({
  settingsReady,
  autoplay,
  hideRelatedVideos,
  nextParam,
  list,
  shuffle,
  related,
}: Params) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (!settingsReady || !autoplay) return;
    if (nextParam) {
      navigate({ to: "/watch", search: { v: nextParam, list, ...(shuffle ? { shuffle } : {}) } });
      return;
    }
    if (hideRelatedVideos) return;
    const next = related?.[0];
    if (next) navigate({ to: "/watch", search: { v: next.id } });
  }, [settingsReady, autoplay, nextParam, list, shuffle, hideRelatedVideos, related, navigate]);
}
