import type { VideoStream } from "../types/stream";

type Props = {
  stream: VideoStream;
};

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function WatchInfo({ stream }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-base font-semibold text-zinc-100 leading-snug">{stream.title}</h1>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={stream.channelAvatar}
            alt={stream.channelName}
            className="w-9 h-9 rounded-full flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{stream.channelName}</p>
            <p className="text-xs text-zinc-500">
              {formatViews(stream.views)} · {formatDate(stream.uploadedAt)}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 px-4 py-1.5 bg-zinc-100 text-zinc-900 text-sm font-medium rounded-full hover:bg-white transition-colors"
        >
          Subscribe
        </button>
      </div>
      <div className="h-px bg-zinc-800" />
    </div>
  );
}
