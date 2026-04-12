import { YoutubeImportDropzone } from "../settings/youtube-import-dropzone";
import { YoutubeImportQueueList } from "./youtube-import-queue-list";

const TAKEOUT_URL =
  "https://takeout.google.com/settings/takeout/custom/youtube,my_activity?dest=mail&frequency=once";

type Props = {
  queue: File[];
  currentIndex: number;
  queueStarted: boolean;
  busy: boolean;
  inlineError: string | null;
  guideOpen: boolean;
  onToggleGuide: () => void;
  onOpenTakeout: () => void;
  onQueueFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearQueue: () => void;
  onStart: () => void;
};

export function YoutubeImportDrop(props: Props) {
  const {
    queue,
    currentIndex,
    queueStarted,
    busy,
    inlineError,
    guideOpen,
    onToggleGuide,
    onOpenTakeout,
    onQueueFiles,
    onRemoveFile,
    onClearQueue,
    onStart,
  } = props;

  return (
    <div className="space-y-4">
      <YoutubeImportDropzone disabled={busy || queueStarted} onSelectFiles={onQueueFiles} />

      <YoutubeImportQueueList
        files={queue}
        currentIndex={currentIndex}
        locked={queueStarted}
        onRemove={onRemoveFile}
        onClear={onClearQueue}
      />

      {inlineError && (
        <div className="rounded-lg border border-danger bg-danger/50 px-4 py-3 text-sm text-danger-strong">
          {inlineError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {queue.length > 0 && (
          <button
            type="button"
            onClick={onStart}
            disabled={busy || queueStarted}
            className="h-9 rounded-lg bg-danger px-4 text-sm font-medium text-white hover:bg-danger-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start import
          </button>
        )}
        <button
          type="button"
          onClick={onToggleGuide}
          className="h-9 rounded-lg border border-border-strong bg-surface px-4 text-sm text-fg-muted hover:bg-surface-strong"
        >
          {guideOpen ? "Hide guide" : "Need help?"}
        </button>
        <button
          type="button"
          onClick={onOpenTakeout}
          className="h-9 rounded-lg border border-border-strong bg-surface px-4 text-sm text-fg-muted hover:bg-surface-strong"
        >
          Open Google Takeout
        </button>
      </div>

      {guideOpen && <TakeoutGuide />}
    </div>
  );
}

function TakeoutGuide() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-sm">
      <p className="font-medium text-fg">How to export from YouTube</p>
      <ol className="mt-3 list-inside list-decimal space-y-2 text-fg-muted">
        <li>
          Go to{" "}
          <a
            href={TAKEOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted underline"
          >
            takeout.google.com
          </a>
        </li>
        <li>Click "Deselect all", then select only YouTube and My Activity</li>
        <li>Choose ZIP format, any size</li>
        <li>Create export and wait for the email</li>
        <li>Download the ZIP and drop it here</li>
      </ol>
      <p className="mt-3 text-xs text-fg-soft">
        We import subscriptions, playlists, and watch history (if available).
      </p>
    </div>
  );
}
