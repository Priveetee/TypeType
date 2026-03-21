import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSearch } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";
import { useBlockedFilter } from "./use-blocked-filter";
import { useSubscriptionFeed } from "./use-subscription-feed";
import { useTrending } from "./use-trending";

type ShortsFeed = {
  shorts: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

const SHORTS_QUERIES = [
  "mrbeast shorts",
  "gaming shorts",
  "football shorts",
  "music shorts",
  "funny shorts",
];

export function useShortsFeed(): ShortsFeed {
  const { filter } = useBlockedFilter();
  const subscriptionFeed = useSubscriptionFeed();
  const trending = useTrending(0);
  const discovery = useQuery({
    queryKey: ["shorts-discovery"],
    queryFn: async () => {
      const pages = await Promise.all(SHORTS_QUERIES.map((query) => fetchSearch(query, 0)));
      const all = pages
        .flatMap((page) => page.items)
        .map(mapVideoItem)
        .filter((stream) => stream.isShortFormContent);
      const seen = new Set<string>();
      return all.filter((stream) => {
        if (seen.has(stream.id)) return false;
        seen.add(stream.id);
        return true;
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const subscriptionShorts = useMemo(
    () => filter(subscriptionFeed.streams).filter((stream) => stream.isShortFormContent),
    [filter, subscriptionFeed.streams],
  );

  const trendingShorts = useMemo(
    () => filter((trending.data ?? []).filter((stream) => stream.isShortFormContent)),
    [filter, trending.data],
  );

  const discoveryShorts = useMemo(() => filter(discovery.data ?? []), [filter, discovery.data]);

  const shorts =
    subscriptionShorts.length > 0
      ? subscriptionShorts
      : discoveryShorts.length > 0
        ? discoveryShorts
        : trendingShorts;
  const source =
    subscriptionShorts.length > 0 ? "subs" : discoveryShorts.length > 0 ? "discovery" : "trending";

  return {
    shorts,
    isLoading:
      shorts.length > 0
        ? false
        : subscriptionFeed.isLoading || discovery.isLoading || trending.isLoading,
    isFetchingNextPage: source === "subs" ? subscriptionFeed.isFetchingNextPage : false,
    hasNextPage: source === "subs" ? subscriptionFeed.hasNextPage : false,
    fetchNextPage:
      source === "subs"
        ? subscriptionFeed.fetchNextPage
        : () => {
            return;
          },
  };
}
