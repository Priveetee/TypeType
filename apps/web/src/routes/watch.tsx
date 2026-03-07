import { createFileRoute } from "@tanstack/react-router";
import { WatchLayout } from "../components/watch-layout";
import { generateStreams } from "../mocks/streams";

const MOCK_STREAM = generateStreams(1)[0];

function WatchPage() {
  return <WatchLayout stream={MOCK_STREAM} />;
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : "",
  }),
  component: WatchPage,
});
