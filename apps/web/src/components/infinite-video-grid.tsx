import { useCallback } from "react";
import { useInfiniteStreams } from "../hooks/use-infinite-streams";
import { ScrollSentinel } from "./scroll-sentinel";
import { VideoCard } from "./video-card";
import { VideoCardSkeleton } from "./video-card-skeleton";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

type Props = {
  queryKey: string;
};

export function InfiniteVideoGrid({ queryKey }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteStreams(queryKey);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const streams = data?.pages.flatMap((p) => p.streams) ?? [];
  const showSkeletons = isLoading || isFetchingNextPage;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {streams.map((stream) => (
          <VideoCard key={stream.id} stream={stream} />
        ))}
        {showSkeletons && SKELETON_KEYS.map((k) => <VideoCardSkeleton key={k} />)}
      </div>
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}
