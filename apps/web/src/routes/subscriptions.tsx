import { createFileRoute } from "@tanstack/react-router";
import { InfiniteVideoGrid } from "../components/infinite-video-grid";

function SubscriptionsPage() {
  return <InfiniteVideoGrid queryKey="subscriptions" />;
}

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
});
