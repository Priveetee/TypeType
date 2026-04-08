import type {
  DownloaderCreateJobRequest,
  DownloaderCreateJobResponse,
  DownloaderJobResponse,
} from "../types/downloader";
import { ApiError } from "./api";
import { API_BASE as BASE } from "./env";

type ErrorBody = {
  error?: string;
  message?: string;
};

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

function readErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const candidate = body as ErrorBody;
    if (typeof candidate.error === "string" && candidate.error.length > 0) return candidate.error;
    if (typeof candidate.message === "string" && candidate.message.length > 0)
      return candidate.message;
  }
  return fallback;
}

export async function createDownloaderJob(
  payload: DownloaderCreateJobRequest,
): Promise<DownloaderCreateJobResponse> {
  const res = await fetch(`${BASE}/downloader/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await readJson(res);
  if (!res.ok) {
    throw new ApiError(readErrorMessage(body, "Failed to create download job"), res.status);
  }
  return body as DownloaderCreateJobResponse;
}

export async function fetchDownloaderJob(jobId: string): Promise<DownloaderJobResponse> {
  const res = await fetch(`${BASE}/downloader/jobs/${encodeURIComponent(jobId)}`);
  const body = await readJson(res);
  if (!res.ok) {
    throw new ApiError(readErrorMessage(body, "Failed to fetch download job"), res.status);
  }
  return body as DownloaderJobResponse;
}

export function triggerDownloaderArtifact(jobId: string) {
  const a = document.createElement("a");
  a.href = `${BASE}/downloader/jobs/${encodeURIComponent(jobId)}/artifact`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}
