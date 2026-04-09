import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDownloaderJob,
  downloadDownloaderArtifact,
  fetchDownloaderJob,
} from "../lib/api-downloader";
import type { DownloaderCreateJobRequest, DownloaderJobStage } from "../types/downloader";

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
  const job = status.data;

  const isQueued = create.isPending || job?.status === "queued";
  const isRunning = job?.status === "running";
  const isDone = job?.status === "done";
  const isFailed = job?.status === "failed";
  const stage: DownloaderJobStage | null = job?.stage ?? null;
  const progressPercent = typeof job?.progressPercent === "number" ? job.progressPercent : null;
  const resolved = job?.resolved ?? null;
  const errorCode = job?.errorCode ?? null;
  const errorText =
    create.error instanceof Error
      ? create.error.message
      : job?.error || (status.error instanceof Error ? status.error.message : null);

  function start(payload: DownloaderCreateJobRequest) {
    create.mutate(payload);
  }

  function openArtifact() {
    if (!jobId) return;
    return downloadDownloaderArtifact(jobId);
  }

  function reset() {
    create.reset();
  }

  return {
    start,
    openArtifact,
    reset,
    jobId,
    stage,
    progressPercent,
    resolved,
    errorCode,
    isQueued,
    isRunning,
    isDone,
    isFailed,
    errorText,
  };
}
