import { useEffect, useState } from "react";
import type { VideoStream } from "../types/stream";
import { Toast } from "./toast";

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
  const [subscribed, setSubscribed] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  function handleSubscribe() {
    const next = !subscribed;
    setSubscribed(next);
    setToastMsg(
      next ? `Subscribed to ${stream.channelName}` : `Unsubscribed from ${stream.channelName}`,
    );
  }

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
      </div>
      <div className="h-px bg-zinc-800" />
      <Toast message={toastMsg} />
    </div>
  );
}
