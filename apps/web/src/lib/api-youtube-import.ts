import { ApiError } from "./api";
import { authed } from "./authed";
import { API_BASE as BASE } from "./env";
import { readErrorMessage, toJob, toPreview, toReport } from "./youtube-import-parse";
import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "./youtube-import-types";

export type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "./youtube-import-types";

export async function createYoutubeTakeoutImport(file: File): Promise<YoutubeTakeoutImportJob> {
  const body = new FormData();
  body.append("archive", file);
  const res = await authed(`${BASE}/imports/youtube-takeout`, { method: "POST", body });
  const payload = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(readErrorMessage(payload, "YouTube import creation failed"), res.status);
  return toJob(payload);
}

export async function fetchYoutubeTakeoutImportJob(
  jobId: string,
): Promise<YoutubeTakeoutImportJob> {
  const res = await authed(`${BASE}/imports/youtube-takeout/${encodeURIComponent(jobId)}`);
  const payload = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      readErrorMessage(payload, "Unable to read YouTube import status"),
      res.status,
    );
  return toJob(payload);
}

export async function fetchYoutubeTakeoutPreview(jobId: string): Promise<YoutubeTakeoutPreview> {
  const res = await authed(`${BASE}/imports/youtube-takeout/${encodeURIComponent(jobId)}/preview`);
  const payload = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      readErrorMessage(payload, "Unable to load YouTube import preview"),
      res.status,
    );
  return toPreview(payload);
}

export async function commitYoutubeTakeoutImport(jobId: string): Promise<YoutubeTakeoutImportJob> {
  const res = await authed(`${BASE}/imports/youtube-takeout/${encodeURIComponent(jobId)}/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      importSubscriptions: true,
      importPlaylists: true,
      importPlaylistItems: true,
    }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(readErrorMessage(payload, "Unable to start YouTube import"), res.status);
  return toJob(payload);
}

export async function fetchYoutubeTakeoutReport(jobId: string): Promise<YoutubeTakeoutReport> {
  const res = await authed(`${BASE}/imports/youtube-takeout/${encodeURIComponent(jobId)}/report`);
  const payload = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      readErrorMessage(payload, "Unable to load YouTube import report"),
      res.status,
    );
  return toReport(payload);
}
