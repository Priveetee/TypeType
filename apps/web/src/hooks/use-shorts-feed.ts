import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSearch } from "../lib/api";
import { fetchSubscriptionShorts } from "../lib/api-user";
import { mapVideoItem } from "../lib/mappers";
import type { SearchPageResponse, SubscriptionFeedPage } from "../types/api";
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

function isStrictShort(stream: VideoStream): boolean {
  if (stream.id.includes("/shorts/")) return true;
  const normalizedType = stream.streamType?.toLowerCase() ?? "";
  if (normalizedType.includes("short")) return true;
  if (stream.isShortFormContent) return true;
  return stream.duration > 0 && stream.duration <= 180;
}

function parseNextPage(nextpage: string | null): number | undefined {
  if (nextpage === null) return undefined;
  const parsed = Number(nextpage);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function flattenSubscriptionShorts(pages: SubscriptionFeedPage[] | undefined): VideoStream[] {
  return (pages ?? []).flatMap((page) => page.videos).map(mapVideoItem);
}

function flattenDiscoveryShorts(pages: SearchPageResponse[] | undefined): VideoStream[] {
  return (pages ?? [])
    .flatMap((page) => page.items)
    .filter((video) => video.isShortFormContent)
    .map(mapVideoItem)
    .filter(isStrictShort);
}

function dedupeShorts(streams: VideoStream[]): VideoStream[] {
  const seen = new Set<string>();
  return streams.filter((stream) => {
    if (seen.has(stream.id)) return false;
    seen.add(stream.id);
    return true;
  });
}

export function useShortsFeed(): ShortsFeed {
  const { isAuthed } = useAuth();
  const { settings } = useSettings();
  const { filter } = useBlockedFilter();

  const subscriptions = useInfiniteQuery({
    queryKey: ["shorts-subscriptions", settings.defaultService],
    queryFn: ({ pageParam }) =>
      fetchSubscriptionShorts(pageParam as number, 30, settings.defaultService, true),
    initialPageParam: 0,
    getNextPageParam: (last) => parseNextPage(last.nextpage),
    enabled: isAuthed,
    staleTime: 5 * 60 * 1000,
  });

  const discovery = useInfiniteQuery({
    queryKey: ["shorts-discovery", settings.defaultService],
    queryFn: ({ pageParam }) =>
      fetchSearch(SHORTS_QUERY, settings.defaultService, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextpage ?? undefined,
    enabled: !isAuthed,
    staleTime: 90 * 1000,
  });

  const shorts = useMemo(() => {
    const merged = isAuthed
      ? flattenSubscriptionShorts(subscriptions.data?.pages)
      : flattenDiscoveryShorts(discovery.data?.pages);
    return filter(dedupeShorts(merged));
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
          return;
        }
        return;
      }
      if (discovery.hasNextPage) void discovery.fetchNextPage();
    },
  };
}
