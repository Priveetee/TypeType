import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiError } from "../lib/api";
import { resolveSabrHttpSessionSrc, sabrQualityOptions } from "../lib/sabr-source";
import type { MediaSrc } from "../lib/vidstack";
import { useAuthStore } from "../stores/auth-store";
import { useSabrQualityStore } from "../stores/sabr-quality-store";
import type { VideoStream } from "../types/stream";

type SabrManifestSrc = {
  src: MediaSrc | null;
  loading: boolean;
};

export function useSabrManifestSrc(stream: VideoStream, enabled: boolean): SabrManifestSrc {
  const authScope = useAuthStore((state) => (state.token ? (state.me?.id ?? "auth") : "guest"));
  const selectedItag = useSabrQualityStore((state) =>
    state.streamId === stream.id ? state.selectedItag : null,
  );
  const setOptions = useSabrQualityStore((state) => state.setOptions);
  useEffect(() => {
    if (!enabled) return;
    const options = sabrQualityOptions(stream);
    setOptions(stream.id, options, options[0]?.itag ?? null);
  }, [enabled, setOptions, stream]);
  const query = useQuery({
    queryKey: ["sabr-manifest", stream.id, selectedItag, authScope],
    queryFn: () => resolveSabrHttpSessionSrc(stream, selectedItag),
    enabled,
    staleTime: 3 * 60 * 1000,
    retry: (count, error) => error instanceof ApiError && error.status === 422 && count < 5,
    retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 4000),
  });
  return { src: query.data ?? null, loading: enabled && query.fetchStatus !== "idle" };
}
