import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { VideoCardSkeleton } from "../components/video-card-skeleton";
import { VideoGrid } from "../components/video-grid";
import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { streamQueryOptions } from "../hooks/use-stream";
import { useSubscriptionFeed } from "../hooks/use-subscription-feed";
import { useSubscriptions } from "../hooks/use-subscriptions";

const SKELETON_COUNT = 12;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `subs-sk-${i}`);

function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const { query } = useSubscriptions();
  const subscriptions = query.data ?? [];
  const { streams, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSubscriptionFeed();
  const { filter } = useBlockedFilter();

  useEffect(() => {
    if (streams.length > 0) {
      const topVideos = streams.slice(0, 5);
      for (const video of topVideos) {
        void queryClient.prefetchQuery(streamQueryOptions(video.id));
      }
    }
  }, [streams, queryClient]);

  if (subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-zinc-400 text-sm">No subscriptions yet.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {SKELETON_KEYS.map((key) => (
          <VideoCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  return (
    <>
      <VideoGrid streams={filter(streams)} />
      <ScrollSentinel onIntersect={fetchNextPage} enabled={hasNextPage && !isFetchingNextPage} />
    </>
  );
}

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
});
