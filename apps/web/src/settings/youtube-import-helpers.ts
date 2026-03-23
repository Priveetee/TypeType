import type { YoutubeTakeoutImportJob } from "../lib/api-youtube-import";

export function applyJobFeedback(job: YoutubeTakeoutImportJob): {
  toast: string;
  inlineError: string | null;
} {
  if (job.status === "completed") return { toast: "Import completed.", inlineError: null };
  if (job.status === "running" || job.status === "pending") {
    return { toast: "Import started. Keep this window open.", inlineError: null };
  }
  const backendError = job.error && job.error.length > 0 ? job.error : null;
  return {
    toast: backendError ?? "Import failed.",
    inlineError: backendError ?? "Import failed.",
  };
}
