import { useCallback } from "react";
import { useInfiniteRelated } from "../hooks/use-infinite-related";
import { AutoplayToggle } from "./autoplay-toggle";
import { RelatedCard } from "./related-card";
import { RelatedCardSkeleton } from "./related-card-skeleton";
import { ScrollSentinel } from "./scroll-sentinel";

const SKELETON_KEYS = Array.from({ length: 4 }, (_, i) => `rs-${i}`);

type Props = {
  videoId: string;
};

export function RelatedVideos({ videoId }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteRelated(videoId);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const streams = data?.pages.flatMap((p) => p.streams) ?? [];
  const showSkeletons = isLoading || isFetchingNextPage;

  return (
    <div className="flex flex-col gap-3">
      <AutoplayToggle />
      {streams.map((stream) => (
        <RelatedCard key={stream.id} stream={stream} />
      ))}
      {showSkeletons && SKELETON_KEYS.map((k) => <RelatedCardSkeleton key={k} />)}
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}
