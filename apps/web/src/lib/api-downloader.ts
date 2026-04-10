import type {
  DownloaderCreateJobRequest,
  DownloaderCreateJobResponse,
  DownloaderJobResponse,
} from "../types/downloader";
import { ApiError } from "./api";
import { API_BASE as BASE } from "./env";
import { isMobileDownloadDevice } from "./ios-device";

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

function extensionFromType(contentType: string | null): string {
  const value = contentType ?? "";
  if (value.includes("video/mp4")) return "mp4";
  if (value.includes("audio/mpeg")) return "mp3";
  if (value.includes("audio/webm")) return "webm";
  if (value.includes("audio/mp4")) return "m4a";
  return "bin";
}

function filenameFromHeader(contentDisposition: string | null): string | null {
  const value = contentDisposition ?? "";
  const utf8 = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8?.[1]) return decodeURIComponent(utf8[1]);
  const classic = value.match(/filename="?([^";]+)"?/i);
  return classic?.[1] ?? null;
}

export async function downloadDownloaderArtifact(jobId: string): Promise<void> {
  const endpoint = `${BASE}/downloader/jobs/${encodeURIComponent(jobId)}/artifact`;
  if (isMobileDownloadDevice()) {
    window.location.assign(endpoint);
    return;
  }
  const res = await fetch(endpoint);
  if (!res.ok) {
    const body = await readJson(res);
    throw new ApiError(readErrorMessage(body, "Failed to download artifact"), res.status);
  }
  const blob = await res.blob();
  const fileName =
    filenameFromHeader(res.headers.get("content-disposition")) ??
    `typetype-download-${jobId}.${extensionFromType(res.headers.get("content-type"))}`;
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  a.rel = "noopener";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}
