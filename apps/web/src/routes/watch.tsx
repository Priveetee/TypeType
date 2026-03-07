import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageSpinner } from "../components/page-spinner";
import { WatchLayout } from "../components/watch-layout";
import { useStream } from "../hooks/use-stream";
import { useHistoryStore } from "../stores/history-store";

function WatchPage() {
  const { v } = Route.useSearch();
  const { data: stream, isLoading, isError } = useStream(v);
  const addEntry = useHistoryStore((s) => s.addEntry);

  useEffect(() => {
    if (stream) addEntry(stream);
  }, [stream, addEntry]);

  if (isLoading) return <PageSpinner />;

  if (isError || !stream) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-zinc-400 text-sm">Failed to load stream.</p>
      </div>
    );
  }

  return <WatchLayout stream={stream} />;
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : "",
  }),
  component: WatchPage,
});
