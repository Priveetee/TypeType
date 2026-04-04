import { Link } from "@tanstack/react-router";
import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportJobSummary } from "../settings/youtube-import-job-summary";
import { ImportMascotLoop } from "./import-mascot-loop";

type Props = {
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
};

export function YoutubeImportDone({ job, preview, report }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-700/35 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/45 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <ImportMascotLoop
            primarySrc="/import-dudu-cooking.webm"
            secondarySrc="/import-cooking-chef.webm"
            className="h-32 w-full rounded-xl object-cover sm:h-28"
            intervalMs={2500}
          />
          <div>
            <p className="text-base font-medium text-zinc-100">Import complete</p>
            <p className="mt-1 text-sm text-zinc-300/80">
              Your data has been plated. Check your subscriptions and playlists.
            </p>
            <Link
              to="/subscriptions"
              className="mt-3 inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500"
            >
              View subscriptions
            </Link>
          </div>
        </div>
      </div>
      <YoutubeImportJobSummary job={job} preview={preview} report={report} />
    </div>
  );
}
