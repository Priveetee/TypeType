import type { DownloaderJobStage, DownloaderResolvedSelection } from "../types/downloader";

type Props = {
  stage: DownloaderJobStage | null;
  progressPercent: number | null;
  resolved: DownloaderResolvedSelection | null;
  errorCode: string | null;
  errorText: string | null;
  immersive?: boolean;
  forceWaiting?: boolean;
};

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
  immersive = false,
  forceWaiting = false,
}: Props) {
  const hasProgress = typeof progressPercent === "number";
  const resolvedLabel = formatResolved(resolved);
  const visibleError =
    errorCode === "exact_selection_unavailable"
      ? exactUnavailableMessage(resolved)
      : (errorText ?? null);
  const showWaiting =
    (forceWaiting || stage === "queued" || stage === "downloading" || stage === "finalizing") &&
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
      {resolvedLabel && !showWaiting && !visibleError && (
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
