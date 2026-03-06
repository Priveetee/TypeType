import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { VideoGrid } from "../components/video-grid";
import { generateStreams } from "../mocks/streams";

function SubscriptionsPage() {
  const streams = useMemo(() => generateStreams(12), []);
  return <VideoGrid streams={streams} />;
}

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
});
