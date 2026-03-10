import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { formatSubscribers, formatViews } from "../lib/format";
import type { VideoStream } from "../types/stream";
import { ChannelAvatar } from "./channel-avatar";
import { Toast } from "./toast";
import { VerifiedBadgeIcon } from "./watch-icons";

type Props = {
  stream: VideoStream;
};

export function WatchInfo({ stream }: Props) {
  const { add, remove, isSubscribed } = useSubscriptions();
  const subscribed = stream.channelUrl ? isSubscribed(stream.channelUrl) : false;
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  function handleSubscribe() {
    if (!stream.channelUrl) return;
    if (subscribed) {
      remove.mutate(stream.channelUrl);
      setToastMsg(`Unsubscribed from ${stream.channelName}`);
    } else {
      add.mutate({
        channelUrl: stream.channelUrl,
        name: stream.channelName,
        avatarUrl: stream.channelAvatar,
      });
      setToastMsg(`Subscribed to ${stream.channelName}`);
    }
  }

  const channelMeta = (
    <div className="flex flex-col min-w-0">
      <p className="text-sm font-medium text-zinc-100 truncate flex items-center gap-1">
        {stream.channelName}
        {stream.uploaderVerified && <VerifiedBadgeIcon />}
      </p>
      <p className="text-xs text-zinc-500">
        {formatSubscribers(stream.uploaderSubscriberCount)}
        {stream.uploadDate && ` · ${stream.uploadDate}`}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-base font-semibold text-zinc-100 leading-snug">{stream.title}</h1>
        <span className="text-sm text-zinc-400 flex-shrink-0 mt-0.5">
          {formatViews(stream.views)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {stream.channelUrl ? (
            <Link
              to="/channel"
              search={{ url: stream.channelUrl }}
              className="flex items-center gap-3 min-w-0 group"
            >
              <ChannelAvatar
                src={stream.channelAvatar}
                name={stream.channelName}
                className="w-9 h-9"
              />
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate group-hover:underline flex items-center gap-1">
                  {stream.channelName}
                  {stream.uploaderVerified && <VerifiedBadgeIcon />}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatSubscribers(stream.uploaderSubscriberCount)}
                  {stream.uploadDate && ` · ${stream.uploadDate}`}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <ChannelAvatar
                src={stream.channelAvatar}
                name={stream.channelName}
                className="w-9 h-9"
              />
              {channelMeta}
            </div>
          )}
        </div>
        {stream.channelUrl && (
          <button
            type="button"
            onClick={handleSubscribe}
            aria-pressed={subscribed}
            className={`flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-zinc-400 ${
              subscribed
                ? "ring-1 ring-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                : "bg-zinc-100 text-zinc-900 hover:bg-white"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
      <div className="h-px bg-zinc-800" />
      <Toast message={toastMsg} />
    </div>
  );
}
