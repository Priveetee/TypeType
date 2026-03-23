import { ApiError } from "./api";
import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
  YoutubeTakeoutReportBucket,
} from "./youtube-import-types";

type ErrorPayload = { error?: string; message?: string };

export function readErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as ErrorPayload;
  if (typeof record.error === "string" && record.error.length > 0) return record.error;
  if (typeof record.message === "string" && record.message.length > 0) return record.message;
  return fallback;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toBucket(value: unknown): YoutubeTakeoutReportBucket | undefined {
  const raw = asObject(value);
  if (!raw) return undefined;
  if (
    typeof raw.imported !== "number" ||
    typeof raw.skipped !== "number" ||
    typeof raw.failed !== "number"
  ) {
    return undefined;
  }
  return { imported: raw.imported, skipped: raw.skipped, failed: raw.failed };
}

export function toJob(value: unknown): YoutubeTakeoutImportJob {
  const obj = asObject(value);
  if (!obj) throw new ApiError("Invalid YouTube import response", 500);
  const status = obj.status;
  const jobId = obj.jobId;
  if (
    typeof jobId !== "string" ||
    (status !== "pending" && status !== "running" && status !== "completed" && status !== "failed")
  ) {
    throw new ApiError("Invalid YouTube import response", 500);
  }
  return {
    jobId,
    status,
    phase: typeof obj.phase === "string" ? obj.phase : undefined,
    progress: typeof obj.progress === "number" ? obj.progress : undefined,
    error: typeof obj.error === "string" ? obj.error : null,
  };
}

export function toPreview(value: unknown): YoutubeTakeoutPreview {
  const obj = asObject(value);
  const counts = obj ? asObject(obj.counts) : null;
  if (!counts) throw new ApiError("Invalid YouTube preview response", 500);
  const subscriptions = counts.subscriptions;
  const playlists = counts.playlists;
  const playlistItems = counts.playlistItems;
  if (
    typeof subscriptions !== "number" ||
    typeof playlists !== "number" ||
    typeof playlistItems !== "number"
  ) {
    throw new ApiError("Invalid YouTube preview response", 500);
  }
  const dedup = obj ? asObject(obj.dedup) : null;
  return {
    counts: {
      subscriptions,
      playlists,
      playlistItems,
      favorites: typeof counts.favorites === "number" ? counts.favorites : undefined,
      watchLater: typeof counts.watchLater === "number" ? counts.watchLater : undefined,
      history: typeof counts.history === "number" ? counts.history : undefined,
    },
    dedup: dedup
      ? {
          subscriptions: typeof dedup.subscriptions === "number" ? dedup.subscriptions : undefined,
          playlists: typeof dedup.playlists === "number" ? dedup.playlists : undefined,
          playlistItems: typeof dedup.playlistItems === "number" ? dedup.playlistItems : undefined,
        }
      : undefined,
    warnings: Array.isArray(obj?.warnings)
      ? obj.warnings.filter((v): v is string => typeof v === "string")
      : [],
    errors: Array.isArray(obj?.errors)
      ? obj.errors.filter((v): v is string => typeof v === "string")
      : [],
  };
}

export function toReport(value: unknown): YoutubeTakeoutReport {
  const obj = asObject(value);
  if (!obj) throw new ApiError("Invalid YouTube report response", 500);
  return {
    subscriptions: toBucket(obj.subscriptions),
    playlists: toBucket(obj.playlists),
    playlistItems: toBucket(obj.playlistItems),
    history: toBucket(obj.history),
    watchLater: toBucket(obj.watchLater),
    favorites: toBucket(obj.favorites),
    warnings: Array.isArray(obj.warnings)
      ? obj.warnings.filter((v): v is string => typeof v === "string")
      : [],
    errors: Array.isArray(obj.errors)
      ? obj.errors.filter((v): v is string => typeof v === "string")
      : [],
  };
}
