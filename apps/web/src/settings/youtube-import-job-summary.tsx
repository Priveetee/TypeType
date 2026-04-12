import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";

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

  return (
    <div className="rounded-xl border border-border/70 bg-surface/90">
      <div className="px-4 py-4 text-xs text-fg-muted">
        <p>
          <span className="text-fg-soft">Import ID:</span> {job.jobId}
        </p>
        <p>
          <span className="text-fg-soft">Status:</span> {statusLabel(job.status)}
        </p>
        {job.phase && (
          <p>
            <span className="text-fg-soft">Phase:</span> {job.phase}
          </p>
        )}
        {preview && (
          <p>
            <span className="text-fg-soft">Preview:</span> {preview.counts.subscriptions}{" "}
            subscriptions, {preview.counts.playlists} playlists, {preview.counts.playlistItems}{" "}
            playlist videos
          </p>
        )}
        {report && (
          <p>
            <span className="text-fg-soft">Imported:</span> {reportText(report)}
          </p>
        )}
      </div>
    </div>
  );
}
