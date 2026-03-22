import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHomeRecommendations } from "../lib/api-user";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";
import { useAuth } from "./use-auth";
import { useSettings } from "./use-settings";

const PAGE_SIZE = 30;

type Result = {
  streams: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export function useHomeRecommendations(): Result {
  const { isAuthed } = useAuth();
  const { settings } = useSettings();
  const query = useInfiniteQuery({
    queryKey: ["home-recommendations", "v2", settings.defaultService],
    queryFn: ({ pageParam }) =>
      fetchHomeRecommendations(settings.defaultService, PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? (last.nextCursor ?? undefined) : undefined),
    enabled: isAuthed,
    staleTime: 90 * 1000,
  });

  const streams = (query.data?.pages ?? []).flatMap((page) => page.items).map(mapVideoItem);

  return {
    streams,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
