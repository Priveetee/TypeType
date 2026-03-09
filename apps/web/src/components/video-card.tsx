import { Link } from "@tanstack/react-router";
import { formatDuration, formatViews } from "../lib/format";
import type { VideoStream } from "../types/stream";

type Props = {
  stream: VideoStream;
};

function ChannelAvatar({ src, name }: { src: string; name: string }) {
  if (!src) {
    return <div className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 bg-zinc-700" title={name} />;
  }
  return <img src={src} alt={name} className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5" />;
}

export function VideoCard({ stream }: Props) {
  return (
    <div className="flex flex-col gap-2 group">
      <Link to="/watch" search={{ v: stream.id }} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {stream.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 rounded">
              {formatDuration(stream.duration)}
            </span>
          )}
        </div>
      </Link>
      <div className="flex gap-2">
        {stream.channelUrl ? (
          <Link to="/channel" search={{ url: stream.channelUrl }} className="flex-shrink-0 mt-0.5">
            <ChannelAvatar src={stream.channelAvatar} name={stream.channelName} />
          </Link>
        ) : (
          <ChannelAvatar src={stream.channelAvatar} name={stream.channelName} />
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to="/watch"
            search={{ v: stream.id }}
            className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug hover:text-white"
          >
            {stream.title}
          </Link>
          {stream.channelUrl ? (
            <Link
              to="/channel"
              search={{ url: stream.channelUrl }}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
            >
              {stream.channelName}
            </Link>
          ) : (
            <p className="text-xs text-zinc-400">{stream.channelName}</p>
          )}
          <p className="text-xs text-zinc-500">
            {formatViews(stream.views)} · {stream.uploadDate}
          </p>
        </div>
      </div>
    </div>
  );
}
