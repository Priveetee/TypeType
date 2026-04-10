import type { DownloaderJobStage, DownloaderResolvedSelection } from "../types/downloader";
import { CardLiquidFill } from "./card-liquid-fill";
import { DownloadPhaseMetrics } from "./download-phase-metrics";

type Props = {
  stage: DownloaderJobStage | null;
  progressPercent: number | null;
  resolved: DownloaderResolvedSelection | null;
  errorCode: string | null;
  errorText: string | null;
  tokenFetchMs: number | null;
  ytdlpMs: number | null;
  uploadMs: number | null;
  totalMs: number | null;
  immersive?: boolean;
  forceWaiting?: boolean;
};

function formatResolved(resolved: DownloaderResolvedSelection | null): string | null {
  if (!resolved) return null;
  const quality =
    typeof resolved.height === "number"
      ? `${resolved.height}p`
      : typeof resolved.bitrate === "number"
        ? `${Math.round(resolved.bitrate)} kbps`
        : null;
  const container =
    typeof resolved.container === "string" && resolved.container.length > 0
      ? resolved.container.toUpperCase()
      : null;
  if (!quality && !container) return null;
  return [quality, container].filter((item) => item !== null).join(" ");
}

function exactUnavailableMessage(resolved: DownloaderResolvedSelection | null): string {
  if (typeof resolved?.height === "number") {
    return `Requested ${resolved.height}p is unavailable. Pick another format.`;
  }
  return "Selected format is unavailable. Pick another format.";
}

function stageLabel(stage: DownloaderJobStage | null): string {
  if (stage === "queued") return "Queued";
  if (stage === "running" || stage === "downloading") return "Downloading";
  if (stage === "finalizing") return "Finalizing";
  if (stage === "cached") return "Ready from cache";
  if (stage === "done") return "Done";
  if (stage === "cancelled") return "Cancelled";
  if (stage === "failed") return "Failed";
  return "Preparing";
}

export function DownloaderJobFeedback({
  stage,
  progressPercent,
  resolved,
  errorCode,
  errorText,
  tokenFetchMs,
  ytdlpMs,
  uploadMs,
  totalMs,
  immersive = false,
  forceWaiting = false,
}: Props) {
  const normalizedProgress =
    typeof progressPercent === "number" ? Math.min(100, Math.max(0, progressPercent)) : 0;
  const hasProgress = typeof progressPercent === "number";
  const resolvedLabel = formatResolved(resolved);
  const visibleError =
    errorCode === "exact_selection_unavailable"
      ? exactUnavailableMessage(resolved)
      : (errorText ?? null);
  const showWaiting =
    (forceWaiting ||
      stage === "queued" ||
      stage === "running" ||
      stage === "downloading" ||
      stage === "finalizing") &&
    hasProgress &&
    !visibleError;

  return (
    <>
      {showWaiting && (
        <div
          className={
            immersive
              ? "h-[min(52svh,24rem)] min-h-52 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-1.5"
              : "mt-2 rounded-md border border-zinc-800 bg-zinc-900/60 p-1.5"
          }
        >
          <div className="h-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70">
            <img
              src="/downloader-waiting.gif"
              alt="Download in progress"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      )}
      {showWaiting && (
        <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/70 p-2">
          <div className="relative h-11 overflow-hidden rounded-md border border-zinc-700 bg-zinc-950/80">
            <CardLiquidFill progress={normalizedProgress} />
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
              <span className="text-zinc-200">{stageLabel(stage)}</span>
              <span className="font-medium text-zinc-100">{normalizedProgress}%</span>
            </div>
          </div>
        </div>
      )}
      {resolvedLabel && !showWaiting && !visibleError && (
        <p className="mt-2 text-xs text-zinc-400">Selected: {resolvedLabel}</p>
      )}
      {visibleError && (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {visibleError}
        </p>
      )}
      {!visibleError && (
        <DownloadPhaseMetrics
          tokenFetchMs={tokenFetchMs}
          ytdlpMs={ytdlpMs}
          uploadMs={uploadMs}
          totalMs={totalMs}
        />
      )}
    </>
  );
}
