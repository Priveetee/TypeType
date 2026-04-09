import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useArtifactDownloadOnDone } from "../hooks/use-artifact-download-on-done";
import { useDownloaderJob } from "../hooks/use-downloader-job";
import { useSmoothDismiss } from "../hooks/use-smooth-dismiss";
import type { VideoStream } from "../types/stream";
import { DownloadModeButton } from "./download-mode-button";
import { DownloadOptionButton } from "./download-option-button";
import {
  buildDownloaderCreatePayload,
  buildDownloadOptions,
  type DownloadMode,
} from "./download-options";
import { DownloaderJobFeedback } from "./downloader-job-feedback";

const MARGIN = 8;

type Props = {
  stream: VideoStream;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDone: (message: string) => void;
};

export function DownloadDropdown({ stream, anchorEl, onClose, onDone }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  const [mode, setMode] = useState<DownloadMode>("video");
  const { isClosing, dismiss } = useSmoothDismiss({ onClose });
  const downloader = useDownloaderJob();
  const { isDone, jobId, isQueued, isRunning, errorText, openArtifact, reset, start } = downloader;
  const isBusy = isQueued || isRunning;
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const allOptions = useMemo(() => buildDownloadOptions(stream), [stream]);
  const optionsByMode = useMemo(
    () => ({
      video: allOptions.filter((option) => option.mode === "video"),
      audio: allOptions.filter((option) => option.mode === "audio"),
    }),
    [allOptions],
  );
  const modeOptions = useMemo(() => optionsByMode[mode], [optionsByMode, mode]);
  const [selectedId, setSelectedId] = useState<string>("");
  const selected = modeOptions.find((option) => option.id === selectedId) ?? modeOptions[0];

  useEffect(() => {
    const nextOptions = optionsByMode[mode];
    setSelectedId(nextOptions.find((option) => option.recommended)?.id ?? nextOptions[0]?.id ?? "");
  }, [mode, optionsByMode]);

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

  useLayoutEffect(() => {
    if (!anchorEl || !panelRef.current) return;
    const anchor = anchorEl.getBoundingClientRect();
    const panel = panelRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let left = anchor.left;
    left = Math.min(left, vw - panel.width - MARGIN);
    left = Math.max(MARGIN, left);
    const spaceBelow = vh - anchor.bottom - MARGIN;
    const spaceAbove = anchor.top - MARGIN;
    const preferBelow = spaceBelow >= panel.height || spaceBelow >= spaceAbove;
    let top = preferBelow ? anchor.bottom + MARGIN : anchor.top - panel.height - MARGIN;
    top = Math.max(MARGIN, Math.min(top, vh - panel.height - MARGIN));
    setPanelStyle({ position: "fixed", top, left, visibility: "visible" });
  }, [anchorEl]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !anchorEl?.contains(target)) dismiss();
    }
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [anchorEl, dismiss]);

  function startDownload() {
    if (!selected) return;
    setArtifactError(null);
    start(buildDownloaderCreatePayload(stream.id, selected));
  }

  return createPortal(
    <div
      ref={panelRef}
      style={panelStyle}
      className={`fixed z-[90] w-[min(24rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl ${isClosing ? "[animation:download-pop-out_0.34s_cubic-bezier(0.22,1,0.36,1)]" : "[animation:download-pop-in_0.2s_ease-out]"}`}
    >
      <div className="border-b border-zinc-800 px-3 py-2">
        <p className="text-sm font-semibold text-zinc-100">Download</p>
        <p className="truncate text-xs text-zinc-400">{stream.title}</p>
      </div>
      {!showWorkingState && (
        <div className="px-3 py-2">
          <div className="mb-2 grid grid-cols-2 gap-2">
            <DownloadModeButton
              active={mode === "video"}
              onClick={() => setMode("video")}
              label="Video"
            />
            <DownloadModeButton
              active={mode === "audio"}
              onClick={() => setMode("audio")}
              label="Audio"
            />
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {modeOptions.map((option, index) => (
              <DownloadOptionButton
                key={option.id}
                option={option}
                selected={option.id === selected?.id}
                onSelect={() => setSelectedId(option.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
      <div className="border-t border-zinc-800 p-3">
        {!showWorkingState && (
          <button
            type="button"
            onClick={startDownload}
            disabled={!selected}
            className="w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
          >
            Start download
          </button>
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
    </div>,
    document.body,
  );
}
