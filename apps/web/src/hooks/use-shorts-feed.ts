import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSearch } from "../lib/api";
import { fetchSubscriptionShorts } from "../lib/api-user";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";
import { useAuth } from "./use-auth";
import { useBlockedFilter } from "./use-blocked-filter";
import { useSettings } from "./use-settings";

type ShortsFeed = {
  shorts: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

const SHORTS_QUERY = "shorts";

export function useShortsFeed(): ShortsFeed {
  const { isAuthed } = useAuth();
  const { settings } = useSettings();
  const { filter } = useBlockedFilter();
  const subscriptions = useInfiniteQuery({
    queryKey: ["shorts-subscriptions"],
    queryFn: ({ pageParam }) => fetchSubscriptionShorts(pageParam as number, 30),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => (last.nextpage !== null ? pages.length : undefined),
    enabled: isAuthed,
    staleTime: 5 * 60 * 1000,
  });

  const discovery = useInfiniteQuery({
    queryKey: ["shorts-discovery", settings.defaultService],
    queryFn: ({ pageParam }) =>
      fetchSearch(SHORTS_QUERY, settings.defaultService, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextpage ?? undefined,
    enabled: true,
    staleTime: 90 * 1000,
  });

  const shorts = useMemo(() => {
    const subscriptionItems = (subscriptions.data?.pages ?? [])
      .flatMap((page) => page.videos)
      .map(mapVideoItem);

    const discoveryItems = (discovery.data?.pages ?? [])
      .flatMap((page) => page.items)
      .filter((video) => video.isShortFormContent)
      .map(mapVideoItem);

    const merged = isAuthed ? subscriptionItems : discoveryItems;
    const seen = new Set<string>();
    const deduped = merged.filter((stream) => {
      if (seen.has(stream.id)) return false;
      seen.add(stream.id);
      return true;
    });

    return filter(deduped);
  }, [subscriptions.data, discovery.data, filter, isAuthed]);

  return {
    shorts,
    isLoading: shorts.length > 0 ? false : isAuthed ? subscriptions.isLoading : discovery.isLoading,
    isFetchingNextPage: isAuthed ? subscriptions.isFetchingNextPage : discovery.isFetchingNextPage,
    hasNextPage: isAuthed ? subscriptions.hasNextPage : discovery.hasNextPage,
    fetchNextPage: () => {
      if (isAuthed) {
        if (subscriptions.hasNextPage) {
          void subscriptions.fetchNextPage();
        }
        return;
      }
      if (discovery.hasNextPage) {
        void discovery.fetchNextPage();
      }
    },
  };
}
