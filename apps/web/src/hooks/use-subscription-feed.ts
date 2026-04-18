import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSubscriptionFeed } from "../lib/api-user";
import { mapVideoItem } from "../lib/mappers";
import { proxyImage } from "../lib/proxy";
import type { VideoStream } from "../types/stream";
import { useAuth } from "./use-auth";
import { useSubscriptions } from "./use-subscriptions";

type Result = {
  streams: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export function useSubscriptionFeed(): Result {
  const { authReady, isAuthed } = useAuth();
  const { query: subsQuery } = useSubscriptions();
  const avatarMap = new Map(
    (subsQuery.data ?? []).map((s) => [s.channelUrl, proxyImage(s.avatarUrl)]),
  );

  const query = useInfiniteQuery({
    queryKey: ["subscription-feed"],
    queryFn: ({ pageParam }) => fetchSubscriptionFeed(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => (last.nextpage !== null ? pages.length : undefined),
    staleTime: 5 * 60 * 1000,
    enabled: authReady && isAuthed,
  });

  const streams = (query.data?.pages ?? [])
    .flatMap((page) => page.videos)
    .map((video) => {
      const mapped = mapVideoItem(video);
      if (!mapped.channelAvatar && mapped.channelUrl) {
        const avatar = avatarMap.get(mapped.channelUrl);
        if (avatar) return { ...mapped, channelAvatar: avatar };
      }
      return mapped;
    });

  return {
    streams,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
