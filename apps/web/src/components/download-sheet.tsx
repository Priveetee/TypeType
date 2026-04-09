import { useMemo, useState } from "react";
import { useArtifactDownloadOnDone } from "../hooks/use-artifact-download-on-done";
import { useDownloaderJob } from "../hooks/use-downloader-job";
import { useOverlayLock } from "../hooks/use-overlay-lock";
import type { VideoStream } from "../types/stream";
import { DownloadModeButton } from "./download-mode-button";
import { DownloadOptionButton } from "./download-option-button";
import {
  buildDownloaderCreatePayload,
  buildDownloadOptions,
  type DownloadMode,
} from "./download-options";
import { buildSimpleChoices } from "./download-simple-choices";
import { DownloaderJobFeedback } from "./downloader-job-feedback";

type Props = {
  stream: VideoStream;
  onClose: () => void;
  onDone: (message: string) => void;
};

export function DownloadSheet({ stream, onClose, onDone }: Props) {
  useOverlayLock(true);
  const downloader = useDownloaderJob();
  const { isDone, jobId, isQueued, isRunning, errorText, openArtifact, reset, start } = downloader;
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const allOptions = useMemo(() => buildDownloadOptions(stream), [stream]);
  const [mode, setMode] = useState<DownloadMode>("video");
  const [showAllFormats, setShowAllFormats] = useState(false);
  const options = allOptions.filter((option) => option.mode === mode);
  const simpleChoices = useMemo(() => buildSimpleChoices(options, mode), [options, mode]);
  const initial = options.find((option) => option.recommended)?.id ?? options[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(initial ?? "");
  const selected = useMemo(
    () => options.find((option) => option.id === selectedId) ?? options[0],
    [options, selectedId],
  );

  useArtifactDownloadOnDone({
    isDone,
    jobId,
    selectedLabel: selected?.label ?? "file",
    openArtifact,
    onDone,
    onClose,
    reset,
    onArtifactError: setArtifactError,
  });

  function selectMode(next: DownloadMode) {
    setMode(next);
    setShowAllFormats(false);
    const nextOptions = allOptions.filter((option) => option.mode === next);
    setSelectedId(nextOptions.find((option) => option.recommended)?.id ?? nextOptions[0]?.id ?? "");
  }

  function startDownload() {
    if (!selected) return;
    setArtifactError(null);
    start(buildDownloaderCreatePayload(stream.id, selected));
  }

  const pendingLabel = isQueued ? "Creating job..." : "Preparing download...";
  const startLabel = isQueued || isRunning ? pendingLabel : "Start download";

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close download"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-10 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl [animation:download-pop-in_0.22s_cubic-bezier(0.16,1,0.3,1)] md:inset-auto md:right-4 md:top-20 md:w-[30rem] md:p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-100">Download</p>
            <p className="text-xs text-zinc-400 truncate max-w-72">{stream.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <DownloadModeButton
            active={mode === "video"}
            onClick={() => selectMode("video")}
            label="Video"
          />
          <DownloadModeButton
            active={mode === "audio"}
            onClick={() => selectMode("audio")}
            label="Audio"
          />
        </div>
        {!showAllFormats && (
          <div className="space-y-2">
            {simpleChoices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setSelectedId(choice.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                  selected?.id === choice.id
                    ? "border-zinc-100 bg-zinc-800 text-zinc-100"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <p className="text-sm font-medium">{choice.title}</p>
                <p className="text-xs text-zinc-400">{choice.option.label}</p>
                <p className="text-xs text-zinc-500">{choice.option.size}</p>
              </button>
            ))}
          </div>
        )}
        {showAllFormats && (
          <div
            className="max-h-[44svh] space-y-1.5 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-width:thin] [scrollbar-color:var(--color-zinc-600)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600/80 [&::-webkit-scrollbar-track]:bg-transparent md:max-h-[52svh]"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            {options.map((option, index) => (
              <DownloadOptionButton
                key={option.id}
                option={option}
                selected={option.id === selected?.id}
                onSelect={() => setSelectedId(option.id)}
                index={index}
                compact
              />
            ))}
          </div>
        )}
        {options.length > simpleChoices.length && (
          <button
            type="button"
            onClick={() => setShowAllFormats((open) => !open)}
            className="mt-2 w-full rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
          >
            {showAllFormats ? "Simple view" : `All formats (${options.length})`}
          </button>
        )}
        <button
          type="button"
          onClick={startDownload}
          disabled={!selected || isQueued || isRunning}
          className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        >
          {startLabel}
        </button>
        <DownloaderJobFeedback
          stage={downloader.stage}
          progressPercent={downloader.progressPercent}
          resolved={downloader.resolved}
          errorCode={downloader.errorCode}
          errorText={artifactError ?? errorText}
        />
      </div>
    </div>
  );
}
