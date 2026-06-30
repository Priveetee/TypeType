import { useQuery } from "@tanstack/react-query";
import { fetchAudioOnlyStream } from "../lib/api-audio-only";

export function useAudioOnlyStream(
  url: string,
  preferOriginal: boolean,
  preferredLocale: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["audio-only", url, preferOriginal, preferredLocale],
    queryFn: () => fetchAudioOnlyStream(url, preferOriginal, preferredLocale),
    enabled: enabled && url.trim().length > 0,
    staleTime: 3 * 60 * 1000,
    retry: false,
  });
}
