import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportJobSummary } from "../settings/youtube-import-job-summary";
import { CardLiquidFill } from "./card-liquid-fill";
import { ImportMascotLoop } from "./import-mascot-loop";

type Props = {
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
  queueLength: number;
  currentIndex: number;
};

function computeProgress(
  job: YoutubeTakeoutImportJob | null,
  queueLength: number,
  currentIndex: number,
): number {
  const phaseWeight = 100 / Math.max(queueLength, 1);
  const baseProgress = currentIndex * phaseWeight;
  const jobProgress = typeof job?.progress === "number" ? job.progress : 0;
  const phaseProgress = (jobProgress / 100) * phaseWeight;
  return Math.min(baseProgress + phaseProgress, 100);
}

export function YoutubeImportCooking({ job, preview, report, queueLength, currentIndex }: Props) {
  const progress = computeProgress(job, queueLength, currentIndex);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-red-700/35 bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950/40 p-4">
        <CardLiquidFill progress={progress} />
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <ImportMascotLoop
            primarySrc="/import-cooking-chef.webm"
            secondarySrc="/import-dudu-cooking.webm"
            className="h-32 w-full rounded-xl object-cover sm:h-28"
          />
          <div>
            <p className="text-base font-medium text-zinc-100">Cooking your import</p>
            <p className="mt-1 text-sm text-zinc-300/80">
              Unpacking and syncing your data. This may take a moment.
            </p>
            <p className="mt-2 text-xs text-zinc-300/75">estimated sync in progress...</p>
          </div>
        </div>
      </div>
      <YoutubeImportJobSummary job={job} preview={preview} report={report} />
    </div>
  );
}
