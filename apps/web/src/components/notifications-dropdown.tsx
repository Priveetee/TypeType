import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationBellIcon } from "./notification-bell-icon";
import { NotificationRow } from "./notification-row";
import { ScrollSentinel } from "./scroll-sentinel";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const {
    enabled,
    query,
    unreadQuery,
    items,
    unreadCount,
    markAllRead,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useNotifications(open);

  useEffect(() => {
    if (!open || hasLoaded) return;
    setHasLoaded(true);
  }, [open, hasLoaded]);

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
        className="relative inline-flex h-9 w-9 items-center justify-center text-zinc-300 hover:text-zinc-100"
        aria-label="Notifications"
      >
        <NotificationBellIcon />
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
            {!hasLoaded && (
              <p className="px-2 py-3 text-xs text-zinc-500">Open notifications to load items.</p>
            )}
            {hasLoaded && query.isFetching && items.length === 0 && (
              <p className="px-2 py-3 text-xs text-zinc-500">Loading notifications...</p>
            )}
            {hasLoaded && query.isError && (
              <p className="px-2 py-3 text-xs text-red-400">
                Failed to load notifications. Retry in a few seconds.
              </p>
            )}
            {hasLoaded && !query.isFetching && !query.isError && items.length === 0 && (
              <p className="px-2 py-3 text-xs text-zinc-500">No notifications yet.</p>
            )}
            {items.map((item) => (
              <NotificationRow
                key={`${item.type}-${item.video.id}-${item.createdAt}`}
                item={item}
                onOpen={() => setOpen(false)}
              />
            ))}
            {hasLoaded && (
              <ScrollSentinel
                root={scrollRoot}
                onIntersect={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                  }
                }}
                enabled={open && hasNextPage && !isFetchingNextPage}
              />
            )}
            {isFetchingNextPage && (
              <p className="px-2 py-2 text-xs text-zinc-500">Loading more...</p>
            )}
            {isFetchNextPageError && (
              <p className="px-2 py-2 text-xs text-red-400">Rate limited while loading more.</p>
            )}
            {unreadQuery.isError && (
              <p className="px-2 py-2 text-xs text-zinc-500">Badge temporarily unavailable.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
