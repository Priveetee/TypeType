import { Link } from "@tanstack/react-router";
import { formatDuration } from "../lib/format";
import type { HistoryItem } from "../types/user";

type ContinueCardProps = {
  item: HistoryItem;
};

export function ContinueCard({ item }: ContinueCardProps) {
  const pct = Math.min(100, Math.round((item.progress / item.duration) * 100));

  return (
    <Link
      to="/watch"
      search={{ v: item.url }}
      className="flex-shrink-0 w-44 flex flex-col gap-2 group"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
          {formatDuration(item.duration)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-700">
          <div className="h-full bg-red-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-100 line-clamp-2 leading-snug group-hover:text-white">
          {item.title}
        </span>
        <span className="text-[10px] text-zinc-500 truncate">{item.channelName}</span>
      </div>
    </Link>
  );
}
