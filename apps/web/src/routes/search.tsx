import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { VideoCard } from "../components/video-card";
import { VideoCardSkeleton } from "../components/video-card-skeleton";
import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useSearch } from "../hooks/use-search";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

function SearchPage() {
  const { q, service } = Route.useSearch();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useSearch(q, service);
  const { filter } = useBlockedFilter();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const streams = filter(data?.pages.flatMap((p) => p.streams) ?? []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {SKELETON_KEYS.map((k) => (
          <VideoCardSkeleton key={k} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {streams.length === 0 ? (
        <p className="text-zinc-400 text-sm">No results for &ldquo;{q}&rdquo;</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {streams.map((stream) => (
            <VideoCard key={stream.id} stream={stream} />
          ))}
          {isFetchingNextPage && SKELETON_KEYS.map((k) => <VideoCardSkeleton key={k} />)}
        </div>
      )}
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    service: typeof search.service === "number" ? search.service : 0,
  }),
  component: SearchPage,
});
