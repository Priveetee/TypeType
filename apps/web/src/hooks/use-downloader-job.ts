import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  createDownloaderJob,
  downloadDownloaderArtifact,
  fetchDownloaderJob,
} from "../lib/api-downloader";
import { canUseDownloaderEvents, subscribeDownloaderEvents } from "../lib/downloader-events";
import type {
  DownloaderCreateJobRequest,
  DownloaderJobResponse,
  DownloaderJobStage,
} from "../types/downloader";

const POLL_MS = 1_500;

export function useDownloaderJob() {
  const [eventJob, setEventJob] = useState<DownloaderJobResponse | null>(null);
  const [sseUnavailable, setSseUnavailable] = useState(false);

  const create = useMutation({
    mutationFn: (payload: DownloaderCreateJobRequest) => createDownloaderJob(payload),
  });
  const jobId = create.data?.id;

  useEffect(() => {
    if (!jobId) return;
    if (!canUseDownloaderEvents()) {
      setSseUnavailable(true);
      return;
    }
    setSseUnavailable(false);
    return subscribeDownloaderEvents(jobId, {
      onMessage: (next) =>
        setEventJob((current) => (current?.id === next.id ? { ...current, ...next } : next)),
      onError: () => setSseUnavailable(true),
    });
  }, [jobId]);

  const status = useQuery({
    queryKey: ["downloader-job", jobId],
    enabled: typeof jobId === "string" && jobId.length > 0,
    queryFn: () => fetchDownloaderJob(jobId ?? ""),
    refetchInterval: (query) => {
      if (
        !sseUnavailable &&
        eventJob &&
        (eventJob.status === "queued" || eventJob.status === "running")
      ) {
        return false;
      }
      const current = query.state.data?.status;
      return current === "queued" || current === "running" ? POLL_MS : false;
    },
  });
  const job = useMemo(() => {
    if (!eventJob) return status.data;
    if (!status.data || status.data.id !== eventJob.id) return eventJob;
    if (status.data.status === "done" || status.data.status === "failed") {
      return {
        ...eventJob,
        ...status.data,
        resolved: status.data.resolved ?? eventJob.resolved,
        error: status.data.error ?? eventJob.error,
        errorCode: status.data.errorCode ?? eventJob.errorCode,
        tokenFetchMs: status.data.tokenFetchMs ?? eventJob.tokenFetchMs,
        ytdlpMs: status.data.ytdlpMs ?? eventJob.ytdlpMs,
        uploadMs: status.data.uploadMs ?? eventJob.uploadMs,
        totalMs: status.data.totalMs ?? eventJob.totalMs,
      };
    }
    return {
      ...status.data,
      ...eventJob,
      resolved: eventJob.resolved ?? status.data.resolved,
      error: eventJob.error ?? status.data.error,
      errorCode: eventJob.errorCode ?? status.data.errorCode,
    };
  }, [eventJob, status.data]);

  const isQueued = create.isPending || job?.status === "queued";
  const isRunning = job?.status === "running";
  const isDone = job?.status === "done";
  const isFailed = job?.status === "failed";
  const stage: DownloaderJobStage | null = job?.stage ?? null;
  const progressPercent = typeof job?.progressPercent === "number" ? job.progressPercent : null;
  const resolved = job?.resolved ?? null;
  const errorCode = job?.errorCode ?? null;
  const tokenFetchMs = typeof job?.tokenFetchMs === "number" ? job.tokenFetchMs : null;
  const ytdlpMs = typeof job?.ytdlpMs === "number" ? job.ytdlpMs : null;
  const uploadMs = typeof job?.uploadMs === "number" ? job.uploadMs : null;
  const totalMs = typeof job?.totalMs === "number" ? job.totalMs : null;
  const errorText =
    create.error instanceof Error
      ? create.error.message
      : job?.error || (status.error instanceof Error ? status.error.message : null);

  function start(payload: DownloaderCreateJobRequest) {
    setEventJob(null);
    setSseUnavailable(false);
    create.mutate(payload);
  }

  function openArtifact() {
    if (!jobId) return;
    return downloadDownloaderArtifact(jobId);
  }

  function reset() {
    setEventJob(null);
    setSseUnavailable(false);
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
    tokenFetchMs,
    ytdlpMs,
    uploadMs,
    totalMs,
    errorCode,
    isQueued,
    isRunning,
    isDone,
    isFailed,
    errorText,
  };
}
