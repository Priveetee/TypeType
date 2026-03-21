import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSearch } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";
import { useBlockedFilter } from "./use-blocked-filter";

type ShortsFeed = {
  shorts: VideoStream[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

const SHORTS_QUERY = "mrbeast shorts";

export function useShortsFeed(): ShortsFeed {
  const { filter } = useBlockedFilter();
  const discovery = useQuery({
    queryKey: ["shorts-discovery"],
    queryFn: async () => {
      const page = await fetchSearch(SHORTS_QUERY, 0);
      const all = page.items.map(mapVideoItem).filter((stream) => stream.isShortFormContent);
      const seen = new Set<string>();
      return all.filter((stream) => {
        if (seen.has(stream.id)) return false;
        seen.add(stream.id);
        return true;
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const shorts = useMemo(() => filter(discovery.data ?? []), [filter, discovery.data]);

  return {
    shorts,
    isLoading: shorts.length > 0 ? false : discovery.isLoading,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: () => {
      return;
    },
  };
}
