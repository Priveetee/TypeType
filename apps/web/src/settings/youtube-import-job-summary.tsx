import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportProgressBar } from "./youtube-import-progress-bar";

type Props = {
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
};

function statusLabel(status: YoutubeTakeoutImportJob["status"]): string {
  if (status === "pending") return "Preparing your import";
  if (status === "running") return "Import in progress";
  if (status === "completed") return "Import finished";
  return "Import failed";
}

function reportText(report: YoutubeTakeoutReport): string {
  const subs = report.subscriptions?.imported ?? 0;
  const playlists = report.playlists?.imported ?? 0;
  const items = report.playlistItems?.imported ?? 0;
  return `${subs} subscriptions • ${playlists} playlists • ${items} playlist videos`;
}

export function YoutubeImportJobSummary({ job, preview, report }: Props) {
  if (!job) return null;
  const progress =
    typeof job.progress === "number" ? job.progress : job.status === "completed" ? 100 : 0;
  const active = job.status === "pending" || job.status === "running";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="px-4 py-4 text-xs text-zinc-400">
        <p>
          <span className="text-zinc-500">Import ID:</span> {job.jobId}
        </p>
        <p>
          <span className="text-zinc-500">Status:</span> {statusLabel(job.status)}
        </p>
        {job.phase && (
          <p>
            <span className="text-zinc-500">Phase:</span> {job.phase}
          </p>
        )}
        {preview && (
          <p>
            <span className="text-zinc-500">Preview:</span> {preview.counts.subscriptions}{" "}
            subscriptions, {preview.counts.playlists} playlists, {preview.counts.playlistItems}{" "}
            playlist videos
          </p>
        )}
        {report && (
          <p>
            <span className="text-zinc-500">Imported:</span> {reportText(report)}
          </p>
        )}
      </div>
      <YoutubeImportProgressBar progress={progress} active={active} />
    </div>
  );
}
