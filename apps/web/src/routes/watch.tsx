import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PageSpinner } from "../components/page-spinner";
import { StreamError } from "../components/stream-error";
import { WatchLayout } from "../components/watch-layout";
import { useHistory } from "../hooks/use-history";
import { useProgress } from "../hooks/use-progress";
import { useStream } from "../hooks/use-stream";
import { ApiError } from "../lib/api";

function WatchPage() {
  const { v } = Route.useSearch();
  const { data: stream, isLoading, isError, error } = useStream(v);
  const { add } = useHistory();
  const progressFetch = useProgress(v);

  const addToHistoryRef = useRef(add.mutate);
  addToHistoryRef.current = add.mutate;

  useEffect(() => {
    if (!stream) return;
    addToHistoryRef.current({
      url: stream.id,
      title: stream.title,
      thumbnail: stream.thumbnail,
      channelName: stream.channelName,
      channelUrl: stream.channelUrl ?? "",
      duration: stream.duration,
      progress: 0,
    });
  }, [stream]);

  if (isLoading || progressFetch.isPending) return <PageSpinner />;

  if (isError || !stream) {
    const message =
      error instanceof ApiError && error.status === 400 ? error.message : "Failed to load stream.";
    return <StreamError message={message} />;
  }

  const savedPosition = progressFetch.data?.position ?? 0;
  const serverPositionMs = (stream.startPosition ?? 0) * 1000;
  const resumeMs = savedPosition > 0 ? savedPosition : serverPositionMs;
  const durationMs = stream.duration * 1000;
  const startTime = resumeMs >= 5000 && resumeMs < durationMs * 0.95 ? resumeMs : 0;

  return <WatchLayout stream={stream} startTime={startTime} />;
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : "",
  }),
  component: WatchPage,
});
