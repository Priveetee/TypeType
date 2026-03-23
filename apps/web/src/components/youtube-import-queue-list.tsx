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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-zinc-300">Queued archives ({files.length})</p>
        <button
          type="button"
          onClick={onClear}
          disabled={locked}
          className="h-7 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-[11px] text-zinc-300 disabled:cursor-not-allowed disabled:text-zinc-600"
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
              className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate text-zinc-200">{file.name}</p>
                <p className="text-zinc-500">{formatBytes(file.size)}</p>
              </div>
              <div className="ml-2 flex items-center gap-2">
                <span className="text-[11px] text-zinc-500">{state}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={locked}
                  className="h-6 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-[11px] text-zinc-300 disabled:cursor-not-allowed disabled:text-zinc-600"
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
