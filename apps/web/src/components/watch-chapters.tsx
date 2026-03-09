import { formatDuration } from "../lib/format";
import type { StreamSegmentItem } from "../types/api";

type Props = {
  segments: StreamSegmentItem[];
  onSeek: (seconds: number) => void;
};

export function WatchChapters({ segments, onSeek }: Props) {
  if (segments.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-zinc-100">Chapters</h2>
      <div className="flex flex-col gap-1">
        {segments.map((seg) => (
          <button
            key={seg.startTimeSeconds}
            type="button"
            onClick={() => onSeek(seg.startTimeSeconds)}
            className="flex items-center gap-3 text-left px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors group"
          >
            <span className="text-xs text-zinc-500 font-mono w-10 flex-shrink-0">
              {formatDuration(seg.startTimeSeconds)}
            </span>
            <span className="text-sm text-zinc-200 group-hover:text-white truncate">
              {seg.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
