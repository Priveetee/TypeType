import { createFileRoute } from "@tanstack/react-router";
import { InfiniteVideoGrid } from "../components/infinite-video-grid";

function TrendingPage() {
  return <InfiniteVideoGrid queryKey="trending" />;
}

export const Route = createFileRoute("/trending")({ component: TrendingPage });
