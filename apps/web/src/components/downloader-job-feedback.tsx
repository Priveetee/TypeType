import type { DownloaderJobStage, DownloaderResolvedSelection } from "../types/downloader";

type Props = {
  stage: DownloaderJobStage | null;
  progressPercent: number | null;
  resolved: DownloaderResolvedSelection | null;
  errorCode: string | null;
  errorText: string | null;
};

function stageLabel(stage: DownloaderJobStage | null): string {
  if (stage === "queued") return "Queued";
  if (stage === "downloading") return "Downloading";
  if (stage === "finalizing") return "Finalizing";
  return "Preparing";
}

function formatResolved(resolved: DownloaderResolvedSelection | null): string | null {
  if (!resolved) return null;
  const quality =
    typeof resolved.height === "number"
      ? `${resolved.height}p`
      : typeof resolved.bitrate === "number"
        ? `${Math.round(resolved.bitrate / 1000)} kbps`
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

export function DownloaderJobFeedback({
  stage,
  progressPercent,
  resolved,
  errorCode,
  errorText,
}: Props) {
  const hasProgress = typeof progressPercent === "number";
  const percent = hasProgress ? Math.max(0, Math.min(100, Math.round(progressPercent))) : 0;
  const resolvedLabel = formatResolved(resolved);
  const visibleError =
    errorCode === "exact_selection_unavailable"
      ? exactUnavailableMessage(resolved)
      : (errorText ?? null);

  return (
    <>
      {hasProgress && !visibleError && (
        <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>{stageLabel(stage)}</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-zinc-300" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
      {resolvedLabel && !visibleError && (
        <p className="mt-2 text-xs text-zinc-400">Selected: {resolvedLabel}</p>
      )}
      {visibleError && (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {visibleError}
        </p>
      )}
    </>
  );
}
