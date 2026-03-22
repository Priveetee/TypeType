import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useSettings } from "../hooks/use-settings";
import { useSubscriptionFeed } from "../hooks/use-subscription-feed";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { useTrending } from "../hooks/use-trending";
import { ScrollSentinel } from "./scroll-sentinel";
import { VideoCardSkeleton } from "./video-card-skeleton";
import { VideoGrid } from "./video-grid";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `hfs-${i}`);

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {SKELETON_KEYS.map((k) => (
        <VideoCardSkeleton key={k} />
      ))}
    </div>
  );
}

function FeedSection() {
  const { streams, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSubscriptionFeed();
  const { filter } = useBlockedFilter();
  if (isLoading) return <SkeletonGrid />;
  return (
    <>
      <VideoGrid streams={filter(streams)} />
      <ScrollSentinel onIntersect={fetchNextPage} enabled={hasNextPage && !isFetchingNextPage} />
    </>
  );
}

function TrendingSection() {
  const { settings } = useSettings();
  const { data: streams, isLoading } = useTrending(settings.defaultService);
  const { filter } = useBlockedFilter();
  if (isLoading) return <SkeletonGrid />;
  return <VideoGrid streams={filter(streams ?? [])} />;
}

export function HomeFallbackSection() {
  const { query } = useSubscriptions();
  const hasSubs = (query.data ?? []).length > 0;
  if (query.isLoading) return <SkeletonGrid />;
  return hasSubs ? <FeedSection /> : <TrendingSection />;
}
