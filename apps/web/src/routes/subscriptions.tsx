import { createFileRoute } from "@tanstack/react-router";
import { VideoGrid } from "../components/video-grid";
import { useSubscriptionFeed } from "../hooks/use-subscription-feed";
import { useSubscriptions } from "../hooks/use-subscriptions";

function SubscriptionsPage() {
  const { query } = useSubscriptions();
  const subscriptions = query.data ?? [];
  const { streams, isLoading } = useSubscriptionFeed();

  if (subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-zinc-400 text-sm">No subscriptions yet.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-zinc-400 text-sm">Loading...</p>
      </div>
    );
  }

  return <VideoGrid streams={streams} />;
}

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
});
