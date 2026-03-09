import { Link } from "@tanstack/react-router";
import { formatDuration, formatViews } from "../lib/format";
import type { VideoStream } from "../types/stream";
import { ChannelAvatar } from "./channel-avatar";
import { VerifiedBadgeIcon } from "./watch-icons";

type Props = {
  stream: VideoStream;
};

export function RelatedCard({ stream }: Props) {
  return (
    <div className="flex gap-2 group">
      <Link
        to="/watch"
        search={{ v: stream.id }}
        className="relative w-40 aspect-video rounded-md overflow-hidden bg-zinc-800 flex-shrink-0"
      >
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
      </Link>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <Link
          to="/watch"
          search={{ v: stream.id }}
          className="text-xs font-medium text-zinc-100 line-clamp-2 leading-snug hover:text-white"
        >
          {stream.title}
        </Link>
        {stream.channelUrl ? (
          <Link
            to="/channel"
            search={{ url: stream.channelUrl }}
            className="flex items-center gap-1.5 mt-0.5 w-fit group/channel"
          >
            <ChannelAvatar
              src={stream.channelAvatar}
              name={stream.channelName}
              className="w-4 h-4"
            />
            <span className="text-xs text-zinc-400 group-hover/channel:text-zinc-200 truncate flex items-center gap-1">
              {stream.channelName}
              {stream.uploaderVerified && <VerifiedBadgeIcon />}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 mt-0.5">
            <ChannelAvatar
              src={stream.channelAvatar}
              name={stream.channelName}
              className="w-4 h-4"
            />
            <span className="text-xs text-zinc-400 truncate flex items-center gap-1">
              {stream.channelName}
              {stream.uploaderVerified && <VerifiedBadgeIcon />}
            </span>
          </div>
        )}
        <p className="text-xs text-zinc-500">{formatViews(stream.views)}</p>
      </div>
    </div>
  );
}
