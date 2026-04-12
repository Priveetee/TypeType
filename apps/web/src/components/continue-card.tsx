import { Link } from "@tanstack/react-router";
import { useWatchPrefetch } from "../hooks/use-watch-prefetch";
import { formatDuration } from "../lib/format";
import type { HistoryItem } from "../types/user";

type ContinueCardProps = {
  item: HistoryItem;
};

export function ContinueCard({ item }: ContinueCardProps) {
  const pct = Math.min(100, Math.round((item.progress / item.duration) * 100));
  const prefetch = useWatchPrefetch(item.url);

  return (
    <Link
      to="/watch"
      search={{ v: item.url }}
      className="flex-shrink-0 w-44 flex flex-col gap-2 group"
      onMouseEnter={prefetch.onMouseEnter}
      onMouseLeave={prefetch.onMouseLeave}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-strong">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
          {formatDuration(item.duration)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-soft">
          <div className="h-full bg-danger-strong" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-fg line-clamp-2 leading-snug group-hover:text-white">
          {item.title}
        </span>
        <span className="text-[10px] text-fg-soft truncate">{item.channelName}</span>
      </div>
    </Link>
  );
}
