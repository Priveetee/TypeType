import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSubscriptionFeed } from "../lib/api-user";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";

type Result = {
  streams: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export function useSubscriptionFeed(): Result {
  const query = useInfiniteQuery({
    queryKey: ["subscription-feed"],
    queryFn: ({ pageParam }) => fetchSubscriptionFeed(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => (last.nextpage !== null ? pages.length : undefined),
    staleTime: 5 * 60 * 1000,
  });

  const streams = (query.data?.pages ?? []).flatMap((page) => page.videos).map(mapVideoItem);

  return {
    streams,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
