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

function formatAge(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function VideoCard({ stream }: Props) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 rounded">
          {formatDuration(stream.duration)}
        </span>
      </div>
      <div className="flex gap-2">
        <img
          src={stream.channelAvatar}
          alt={stream.channelName}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
            {stream.title}
          </p>
          <p className="text-xs text-zinc-400">{stream.channelName}</p>
          <p className="text-xs text-zinc-500">
            {formatViews(stream.views)} · {formatAge(stream.uploadedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
