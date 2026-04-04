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
      <div className="rounded-2xl border border-red-700/35 bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950/45 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <ImportMascotLoop
            primarySrc="/import-dudu-cooking.webm"
            secondarySrc="/import-cooking-chef.webm"
            className="h-32 w-full rounded-xl object-cover sm:h-28"
            intervalMs={2600}
          />
          <div>
            <p className="text-base font-medium text-zinc-100">Import complete</p>
            <p className="mt-1 text-sm text-zinc-300/80">Your backup has been restored.</p>
            <Link
              to="/subscriptions"
              className="mt-3 inline-flex h-8 items-center rounded-md bg-red-600 px-3 text-xs text-white hover:bg-red-500"
            >
              View subscriptions
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-4 text-xs">
        <p>
          <span className="text-zinc-400">History:</span>{" "}
          <span className="text-zinc-200">{summary.history}</span>
        </p>
        <p>
          <span className="text-zinc-400">Subscriptions:</span>{" "}
          <span className="text-zinc-200">{summary.subscriptions}</span>
        </p>
        <p>
          <span className="text-zinc-400">Playlists:</span>{" "}
          <span className="text-zinc-200">{summary.playlists}</span>
        </p>
        <p>
          <span className="text-zinc-400">Playlist videos:</span>{" "}
          <span className="text-zinc-200">{summary.playlistVideos}</span>
        </p>
        <p>
          <span className="text-zinc-400">Watch dates:</span>{" "}
          <span className="text-zinc-200">
            {formatRestoreTimeRange(summary.historyMinWatchedAt, summary.historyMaxWatchedAt)}
          </span>
        </p>
      </div>
    </div>
  );
}
