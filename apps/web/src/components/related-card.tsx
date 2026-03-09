import { Link } from "@tanstack/react-router";
import type { VideoStream } from "../types/stream";

type Props = {
  stream: VideoStream;
};

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RelatedCard({ stream }: Props) {
  return (
    <Link to="/watch" search={{ v: stream.id }} className="flex gap-2 group">
      <div className="relative w-40 aspect-video rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {stream.duration > 0 && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
            {formatDuration(stream.duration)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-100 line-clamp-2 leading-snug group-hover:text-white">
          {stream.title}
        </p>
        <p className="text-xs text-zinc-400">{stream.channelName}</p>
        <p className="text-xs text-zinc-500">{formatViews(stream.views)}</p>
      </div>
    </Link>
  );
}
