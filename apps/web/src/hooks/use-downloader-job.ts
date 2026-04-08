import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDownloaderJob,
  fetchDownloaderJob,
  triggerDownloaderArtifact,
} from "../lib/api-downloader";
import type { DownloaderCreateJobRequest } from "../types/downloader";

const POLL_MS = 1_500;

export function useDownloaderJob() {
  const create = useMutation({
    mutationFn: (payload: DownloaderCreateJobRequest) => createDownloaderJob(payload),
  });
  const jobId = create.data?.id;
  const status = useQuery({
    queryKey: ["downloader-job", jobId],
    enabled: typeof jobId === "string" && jobId.length > 0,
    queryFn: () => fetchDownloaderJob(jobId ?? ""),
    refetchInterval: (query) => {
      const current = query.state.data?.status;
      return current === "queued" || current === "running" ? POLL_MS : false;
    },
  });

  const isQueued = create.isPending || status.data?.status === "queued";
  const isRunning = status.data?.status === "running";
  const isDone = status.data?.status === "done";
  const isFailed = status.data?.status === "failed";
  const errorText =
    create.error instanceof Error
      ? create.error.message
      : status.data?.error || (status.error instanceof Error ? status.error.message : null);

  function start(payload: DownloaderCreateJobRequest) {
    create.mutate(payload);
  }

  function openArtifact() {
    if (!jobId) return;
    triggerDownloaderArtifact(jobId);
  }

  function reset() {
    create.reset();
  }

  return {
    start,
    openArtifact,
    reset,
    jobId,
    isQueued,
    isRunning,
    isDone,
    isFailed,
    errorText,
  };
}
