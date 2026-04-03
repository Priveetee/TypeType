import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import { formatPublishedDate } from "../lib/format";
import { proxyImage } from "../lib/proxy";
import type { NotificationItem } from "../types/notifications";
import { ScrollSentinel } from "./scroll-sentinel";

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      role="img"
      aria-label="Notifications"
    >
      <title>Notifications</title>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h11" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function NotificationRow({ item, onOpen }: { item: NotificationItem; onOpen: () => void }) {
  const videoId = item.video.url.trim().length > 0 ? item.video.url : item.video.id;
  const createdText = formatPublishedDate(item.createdAt) || "recent";
  return (
    <Link
      to="/watch"
      search={{ v: videoId }}
      className="grid grid-cols-[96px_1fr] gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800 [animation:card-pop-in_0.24s_ease-out]"
      onClick={onOpen}
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

export function NavbarNotifications() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const {
    enabled,
    query,
    items,
    unreadCount,
    markAllRead,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNotifications();

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, []);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[26rem] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Notifications
            </p>
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={unreadCount === 0 || markAllRead.isPending}
              className="text-xs text-zinc-300 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-600"
            >
              Mark all read
            </button>
          </div>

          <div ref={setScrollRoot} className="max-h-[28rem] overflow-y-auto px-2 py-2">
            {query.isLoading && (
              <p className="px-2 py-3 text-xs text-zinc-500">Loading notifications...</p>
            )}
            {!query.isLoading && items.length === 0 && (
              <p className="px-2 py-3 text-xs text-zinc-500">No notifications yet.</p>
            )}
            {items.map((item) => (
              <NotificationRow
                key={`${item.type}-${item.video.id}-${item.createdAt}`}
                item={item}
                onOpen={() => setOpen(false)}
              />
            ))}
            <ScrollSentinel
              root={scrollRoot}
              onIntersect={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  void fetchNextPage();
                }
              }}
              enabled={open && hasNextPage && !isFetchingNextPage}
            />
            {isFetchingNextPage && (
              <p className="px-2 py-2 text-xs text-zinc-500">Loading more...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
