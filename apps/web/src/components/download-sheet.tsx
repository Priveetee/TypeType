import { useMemo, useState } from "react";
import { useArtifactDownloadOnDone } from "../hooks/use-artifact-download-on-done";
import { useDownloaderJob } from "../hooks/use-downloader-job";
import { useOverlayLock } from "../hooks/use-overlay-lock";
import { useSmoothDismiss } from "../hooks/use-smooth-dismiss";
import type { VideoStream } from "../types/stream";
import {
  buildDownloaderCreatePayload,
  buildDownloadOptions,
  type DownloadMode,
} from "./download-options";
import { DownloadSheetPicker } from "./download-sheet-picker";
import { DownloaderJobFeedback } from "./downloader-job-feedback";

type Props = {
  stream: VideoStream;
  onClose: () => void;
  onDone: (message: string) => void;
};

export function DownloadSheet({ stream, onClose, onDone }: Props) {
  useOverlayLock(true);
  const { isClosing, dismiss } = useSmoothDismiss({ onClose });
  const downloader = useDownloaderJob();
  const { isDone, jobId, isQueued, isRunning, errorText, openArtifact, reset, start } = downloader;
  const isBusy = isQueued || isRunning;
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const options = useMemo(() => buildDownloadOptions(stream), [stream]);
  const [mode, setMode] = useState<DownloadMode>("video");
  const [selectedId, setSelectedId] = useState(
    options.find((option) => option.recommended)?.id ?? options[0]?.id ?? "",
  );
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  const completion = useArtifactDownloadOnDone({
    isDone,
    jobId,
    selectedLabel: selected?.label ?? "file",
    openArtifact,
    onDone,
    onDismiss: dismiss,
    reset,
    onArtifactError: setArtifactError,
  });
  const showWorkingState = isBusy || completion.isCompleting;

  function selectMode(next: DownloadMode) {
    setMode(next);
    const modeOptions = options.filter((option) => option.mode === next);
    setSelectedId(modeOptions.find((option) => option.recommended)?.id ?? modeOptions[0]?.id ?? "");
  }

  function startDownload() {
    if (!selected) return;
    setArtifactError(null);
    start(buildDownloaderCreatePayload(stream.id, selected));
  }

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close download"
        onClick={dismiss}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-10 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl ${isClosing ? "[animation:download-pop-out_0.34s_cubic-bezier(0.22,1,0.36,1)]" : "[animation:download-pop-in_0.22s_cubic-bezier(0.16,1,0.3,1)]"} md:inset-auto md:right-4 md:top-20 md:w-[30rem] md:p-4`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-100">Download</p>
            <p className="max-w-72 truncate text-xs text-zinc-400">{stream.title}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
        {!showWorkingState && (
          <>
            <DownloadSheetPicker
              mode={mode}
              options={options}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMode={selectMode}
            />
            <button
              type="button"
              onClick={startDownload}
              disabled={!selected}
              className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
            >
              Start download
            </button>
          </>
        )}
        <DownloaderJobFeedback
          stage={downloader.stage}
          progressPercent={downloader.progressPercent}
          resolved={downloader.resolved}
          errorCode={downloader.errorCode}
          errorText={artifactError ?? errorText}
          immersive={showWorkingState}
          forceWaiting={completion.isCompleting}
        />
      </div>
    </div>
  );
}
