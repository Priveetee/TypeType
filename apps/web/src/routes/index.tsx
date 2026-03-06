import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { VideoGrid } from "../components/video-grid";
import { generateStreams } from "../mocks/streams";

function HomePage() {
  const streams = useMemo(() => generateStreams(24), []);
  return <VideoGrid streams={streams} />;
}

export const Route = createFileRoute("/")({ component: HomePage });
