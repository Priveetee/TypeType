import { Link } from "@tanstack/react-router";
import { useWatchPrefetch } from "../hooks/use-watch-prefetch";
import { formatPublishedDate } from "../lib/format";
import { proxyImage } from "../lib/proxy";
import type { NotificationItem } from "../types/notifications";

type Props = {
  item: NotificationItem;
  onOpen: () => void;
};

export function NotificationRow({ item, onOpen }: Props) {
  const videoId = item.video.url.trim().length > 0 ? item.video.url : item.video.id;
  const createdText = formatPublishedDate(item.createdAt) || "recent";
  const prefetch = useWatchPrefetch(videoId);

  return (
    <Link
      to="/watch"
      search={{ v: videoId }}
      className="grid grid-cols-[96px_1fr] gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800 [animation:card-pop-in_0.24s_ease-out]"
      onClick={onOpen}
      onMouseEnter={prefetch.onMouseEnter}
      onMouseLeave={prefetch.onMouseLeave}
    >
      <img
        src={proxyImage(item.video.thumbnailUrl)}
        alt={item.video.title}
        className="h-[54px] w-24 rounded object-cover"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium leading-tight text-zinc-100">
          {item.video.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <img
            src={proxyImage(item.channelAvatarUrl)}
            alt={item.channelName}
            className="h-4 w-4 rounded-full"
            loading="lazy"
          />
          <span className="truncate text-xs text-zinc-300">{item.channelName}</span>
          <span className="text-xs text-zinc-500">{createdText}</span>
        </div>
      </div>
    </Link>
  );
}
