import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useSubscriptionFeed } from "../hooks/use-subscription-feed";
import { useSubscriptions } from "../hooks/use-subscriptions";
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

export function HomeFallbackSection() {
  const { query } = useSubscriptions();
  const hasSubs = (query.data ?? []).length > 0;
  if (query.isLoading) return <SkeletonGrid />;
  if (hasSubs) return <FeedSection />;
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
      <h2 className="text-sm font-semibold text-zinc-100">No subscriptions yet</h2>
      <p className="mt-1 text-xs text-zinc-400">
        Subscribe to channels to unlock a personalized home feed.
      </p>
    </section>
  );
}
