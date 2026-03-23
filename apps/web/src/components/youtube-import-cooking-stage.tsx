import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportJobSummary } from "../settings/youtube-import-job-summary";

type Props = {
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
};

export function YoutubeImportCookingStage({ job, preview, report }: Props) {
  const running = job ? job.status === "pending" || job.status === "running" : false;
  const gif = running ? "/import-cooking-chef.gif" : "/import-dudu-cooking.gif";
  const title = running ? "Cooking your import" : "Import kitchen done";
  const text = running
    ? "We are unpacking and syncing your data. This can take a few minutes."
    : "Everything is plated. You can close this window when you are ready.";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <img
            src={gif}
            alt="Cooking progress"
            className="h-32 w-full rounded-xl object-cover sm:h-28"
          />
          <div>
            <p className="text-base font-medium text-zinc-100">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{text}</p>
          </div>
        </div>
      </div>
      <YoutubeImportJobSummary job={job} preview={preview} report={report} />
    </div>
  );
}
