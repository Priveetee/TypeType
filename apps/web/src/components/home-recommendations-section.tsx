import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useHomeRecommendations } from "../hooks/use-home-recommendations";
import { ScrollSentinel } from "./scroll-sentinel";
import { VideoCardSkeleton } from "./video-card-skeleton";
import { VideoGrid } from "./video-grid";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `hrs-${i}`);

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {SKELETON_KEYS.map((k) => (
        <VideoCardSkeleton key={k} />
      ))}
    </div>
  );
}

export function HomeRecommendationsSection() {
  const { streams, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useHomeRecommendations();
  const { filter } = useBlockedFilter();
  const filtered = filter(streams);

  if (isLoading) return <SkeletonGrid />;
  return (
    <>
      <VideoGrid streams={filtered} />
      <ScrollSentinel onIntersect={fetchNextPage} enabled={hasNextPage && !isFetchingNextPage} />
    </>
  );
}
