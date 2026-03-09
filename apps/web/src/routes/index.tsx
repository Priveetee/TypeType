import { createFileRoute } from "@tanstack/react-router";
import { ContinueWatching } from "../components/continue-watching";
import { VideoCardSkeleton } from "../components/video-card-skeleton";
import { VideoGrid } from "../components/video-grid";
import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useSettings } from "../hooks/use-settings";
import { useSubscriptionFeed } from "../hooks/use-subscription-feed";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { useTrending } from "../hooks/use-trending";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {SKELETON_KEYS.map((k) => (
        <VideoCardSkeleton key={k} />
      ))}
    </div>
  );
}

function FeedSection() {
  const { streams, isLoading } = useSubscriptionFeed();
  const { filter } = useBlockedFilter();
  if (isLoading) return <SkeletonGrid />;
  return <VideoGrid streams={filter(streams)} />;
}

function TrendingSection() {
  const { settings } = useSettings();
  const { data: streams, isLoading } = useTrending(settings.defaultService);
  const { filter } = useBlockedFilter();
  if (isLoading) return <SkeletonGrid />;
  return <VideoGrid streams={filter(streams ?? [])} />;
}

function HomePage() {
  const { query } = useSubscriptions();
  const hasSubs = (query.data ?? []).length > 0;
  const title = hasSubs ? "Your feed" : "Trending";

  return (
    <div className="flex flex-col gap-8">
      <ContinueWatching />
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">{title}</p>
        {hasSubs ? <FeedSection /> : <TrendingSection />}
      </section>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: HomePage });
