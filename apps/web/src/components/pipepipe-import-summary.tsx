import { Link } from "@tanstack/react-router";
import type { PipePipeRestoreSummary } from "../lib/api-restore";
import { formatRestoreTimeRange } from "../lib/restore-time";
import { ImportMascotLoop } from "./import-mascot-loop";

type Props = {
  summary: PipePipeRestoreSummary;
};

export function PipePipeImportSummary({ summary }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-danger/35 bg-gradient-to-br from-surface via-surface to-danger/45 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <ImportMascotLoop
            primarySrc="/import-dudu-cooking.webm"
            secondarySrc="/import-cooking-chef.webm"
            className="h-32 w-full rounded-xl object-cover sm:h-28"
            intervalMs={2600}
          />
          <div>
            <p className="text-base font-medium text-fg">Import complete</p>
            <p className="mt-1 text-sm text-fg-muted/80">Your backup has been restored.</p>
            <Link
              to="/subscriptions"
              className="mt-3 inline-flex h-8 items-center rounded-md bg-danger px-3 text-xs text-white hover:bg-danger-strong"
            >
              View subscriptions
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border-strong bg-surface/80 px-4 py-4 text-xs">
        <p>
          <span className="text-fg-muted">History:</span>{" "}
          <span className="text-fg">{summary.history}</span>
        </p>
        <p>
          <span className="text-fg-muted">Subscriptions:</span>{" "}
          <span className="text-fg">{summary.subscriptions}</span>
        </p>
        <p>
          <span className="text-fg-muted">Playlists:</span>{" "}
          <span className="text-fg">{summary.playlists}</span>
        </p>
        <p>
          <span className="text-fg-muted">Playlist videos:</span>{" "}
          <span className="text-fg">{summary.playlistVideos}</span>
        </p>
        <p>
          <span className="text-fg-muted">Watch dates:</span>{" "}
          <span className="text-fg">
            {formatRestoreTimeRange(summary.historyMinWatchedAt, summary.historyMaxWatchedAt)}
          </span>
        </p>
      </div>
    </div>
  );
}
