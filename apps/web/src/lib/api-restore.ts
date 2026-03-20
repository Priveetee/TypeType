import { ApiError } from "./api";
import { authed } from "./authed";
import { API_BASE as BASE } from "./env";

export type PipePipeTimeMode = "raw" | "normalized";

export type PipePipeRestoreSummary = {
  history: number;
  subscriptions: number;
  playlists: number;
  playlistVideos: number;
  progress: number;
  searchHistory: number;
  timeMode: PipePipeTimeMode;
  historyMinWatchedAt: number | null;
  historyMaxWatchedAt: number | null;
};

type ErrorPayload = {
  error?: string;
};

function readErrorMessage(payload: unknown, fallback = "Restore failed"): string {
  if (!payload || typeof payload !== "object") return fallback;
  const candidate = payload as ErrorPayload;
  if (typeof candidate.error === "string" && candidate.error.length > 0) return candidate.error;
  return fallback;
}

export async function restorePipePipe(
  file: File,
  timeMode: PipePipeTimeMode,
): Promise<PipePipeRestoreSummary> {
  const body = new FormData();
  body.append("file", file);
  const search = new URLSearchParams({ timeMode });
  const res = await authed(`${BASE}/restore/pipepipe?${search.toString()}`, {
    method: "POST",
    body,
  });
  const payload = (await res.json().catch(() => ({}))) as PipePipeRestoreSummary | ErrorPayload;
  if (!res.ok) {
    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const suffix = retryAfter ? ` Try again in ${retryAfter}s.` : "";
      throw new ApiError(readErrorMessage(payload, `Too many restore attempts.${suffix}`), 429);
    }
    throw new ApiError(readErrorMessage(payload), res.status);
  }
  return payload as PipePipeRestoreSummary;
}
