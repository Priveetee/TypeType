import { useEffect, useRef, useState } from "react";
import { usePipePipeRestore } from "../hooks/use-pipepipe-restore";
import { ApiError } from "../lib/api";
import type { PipePipeRestoreSummary } from "../lib/api-restore";
import { formatRestoreTimeRange } from "../lib/restore-time";
import { YoutubeImportStep } from "../settings/youtube-import-step";
import { Toast } from "./toast";

type Props = { onImported: () => void };

export function PipePipeImportModal({ onImported }: Props) {
  const { restore } = usePipePipeRestore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState(false);
  const [started, setStarted] = useState(false);
  const [summary, setSummary] = useState<PipePipeRestoreSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function openPicker() {
    if (restore.isPending) return;
    fileRef.current?.click();
  }

  function onFileSelected(file: File) {
    setPicked(true);
    setStarted(true);
    restore.mutate(
      { file, timeMode: "normalized" },
      {
        onSuccess: (result) => {
          setSummary(result);
          setToast("PipePipe import completed.");
          onImported();
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            setToast(error.message);
            return;
          }
          setToast("PipePipe import failed.");
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <YoutubeImportStep
        number={1}
        title="Select your PipePipe backup"
        description="Choose a ZIP containing newpipe.db or pipepipe.db."
        cta={restore.isPending ? "Importing..." : "Choose ZIP"}
        onCta={openPicker}
        done={picked}
        active={!picked}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            onFileSelected(file);
          }}
        />
      </YoutubeImportStep>
      <YoutubeImportStep
        number={2}
        title="Import data"
        description="We restore history, subscriptions, playlists, and progress."
        cta=""
        done={summary !== null}
        active={started && summary === null}
      >
        {summary && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-4 text-xs text-zinc-400">
            <p>
              <span className="text-zinc-500">History:</span> {summary.history}
            </p>
            <p>
              <span className="text-zinc-500">Subscriptions:</span> {summary.subscriptions}
            </p>
            <p>
              <span className="text-zinc-500">Playlists:</span> {summary.playlists}
            </p>
            <p>
              <span className="text-zinc-500">Playlist videos:</span> {summary.playlistVideos}
            </p>
            <p>
              <span className="text-zinc-500">Watch dates:</span>{" "}
              {formatRestoreTimeRange(summary.historyMinWatchedAt, summary.historyMaxWatchedAt)}
            </p>
          </div>
        )}
      </YoutubeImportStep>
      <Toast message={toast} />
    </div>
  );
}
