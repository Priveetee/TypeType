import { useQuery } from "@tanstack/react-query";
import { fetchDeArrow } from "../lib/api-dearrow";
import { youtubeVideoId } from "../lib/watch-url";
import { useSettings } from "./use-settings";

export function useDeArrow(sourceUrl: string) {
  const { settings } = useSettings();
  const videoId = youtubeVideoId(sourceUrl);
  return useQuery({
    queryKey: ["dearrow", videoId],
    queryFn: () => fetchDeArrow(videoId ?? ""),
    enabled: settings.deArrowEnabled && videoId !== null,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
}
