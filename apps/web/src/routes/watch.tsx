import { createFileRoute } from "@tanstack/react-router";
import { WatchLayout } from "../components/watch-layout";
import { generateComments } from "../mocks/comments";
import { generateStreams } from "../mocks/streams";

const MOCK_STREAM = generateStreams(1)[0];
const MOCK_RELATED = generateStreams(12);
const MOCK_COMMENTS = generateComments(20);

function WatchPage() {
  return <WatchLayout stream={MOCK_STREAM} related={MOCK_RELATED} comments={MOCK_COMMENTS} />;
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : "",
  }),
  component: WatchPage,
});
