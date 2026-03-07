import { createFileRoute } from "@tanstack/react-router";
import { InfiniteVideoGrid } from "../components/infinite-video-grid";

function HomePage() {
  return <InfiniteVideoGrid queryKey="home" />;
}

export const Route = createFileRoute("/")({ component: HomePage });
