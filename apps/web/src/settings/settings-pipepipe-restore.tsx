import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Toast } from "../components/toast";
import { usePipePipeRestore } from "../hooks/use-pipepipe-restore";
import { ApiError } from "../lib/api";
import type { PipePipeRestoreSummary } from "../lib/api-restore";
import { formatRestoreTimeRange } from "../lib/restore-time";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

function summaryRows(summary: PipePipeRestoreSummary): Array<{ label: string; value: number }> {
  return [
    { label: "History", value: summary.history },
    { label: "Subscriptions", value: summary.subscriptions },
    { label: "Playlists", value: summary.playlists },
    { label: "Playlist videos", value: summary.playlistVideos },
    { label: "Progress", value: summary.progress },
    { label: "Search history", value: summary.searchHistory },
  ];
}

export function SettingsPipePipeRestore() {
  const { restore } = usePipePipeRestore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [summary, setSummary] = useState<PipePipeRestoreSummary | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function openPicker() {
    if (restore.isPending) return;
    fileRef.current?.click();
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    restore.mutate(
      { file, timeMode: "normalized" },
      {
        onSuccess: (result) => {
          setSummary(result);
          setToast("PipePipe backup restored");
        },
        onError: (error) => {
          setSummary(null);
          if (error instanceof ApiError) {
            setToast(error.message);
            return;
          }
          setToast("Restore failed");
        },
      },
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Backup</p>
      <div className={CARD}>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Import PipePipe backup</span>
            <span className="text-xs text-zinc-500">
              Upload a ZIP with newpipe.db or pipepipe.db
            </span>
            <span className="text-xs text-zinc-500">
              Watch dates are automatically rebased to the last 30 days
            </span>
          </div>
          <div className="ml-6 flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={restore.isPending}
              className="h-8 rounded-md bg-zinc-900 px-2.5 text-xs text-zinc-300 transition-colors hover:text-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-600"
            >
              {restore.isPending ? "Importing..." : "Import ZIP"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            className="hidden"
            onChange={handleImport}
          />
        </div>
        {summary && (
          <div className="px-4 py-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-400">
            {summaryRows(summary).map((item) => (
              <p key={item.label}>
                <span className="text-zinc-500">{item.label}:</span> {item.value}
              </p>
            ))}
            <p>
              <span className="text-zinc-500">Time mode:</span> Last 30 days (automatic)
            </p>
            <p className="col-span-2">
              <span className="text-zinc-500">Watch date range:</span>{" "}
              {formatRestoreTimeRange(summary.historyMinWatchedAt, summary.historyMaxWatchedAt)}
            </p>
          </div>
        )}
      </div>
      <Toast message={toast} />
    </section>
  );
}
