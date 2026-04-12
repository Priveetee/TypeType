type Props = {
  files: File[];
  currentIndex: number;
  locked: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
};

function formatBytes(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

export function YoutubeImportQueueList({ files, currentIndex, locked, onRemove, onClear }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-app p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-fg-muted">Queued archives ({files.length})</p>
        <button
          type="button"
          onClick={onClear}
          disabled={locked}
          className="h-7 rounded-md border border-border-strong bg-surface px-2 text-[11px] text-fg-muted disabled:cursor-not-allowed disabled:text-fg-soft"
        >
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {files.map((file, index) => {
          const state = locked
            ? index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "queued"
            : "queued";
          return (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center justify-between rounded-md border border-border bg-surface px-2 py-1.5 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate text-fg">{file.name}</p>
                <p className="text-fg-soft">{formatBytes(file.size)}</p>
              </div>
              <div className="ml-2 flex items-center gap-2">
                <span className="text-[11px] text-fg-soft">{state}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={locked}
                  className="h-6 rounded-md border border-border-strong bg-surface px-2 text-[11px] text-fg-muted disabled:cursor-not-allowed disabled:text-fg-soft"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
