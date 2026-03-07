import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { formatDuration, formatViews } from "../lib/format";
import type { VideoStream } from "../types/stream";

const PREVIEW_DELAY_MS = 3000;

type Props = {
  stream: VideoStream;
};

export function VideoCard({ stream }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (!stream.previewUrl) return;
    timerRef.current = setTimeout(() => setPreviewing(true), PREVIEW_DELAY_MS);
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPreviewing(false);
  }

  return (
    <Link
      to="/watch"
      search={{ v: stream.id }}
      className="flex flex-col gap-2 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {previewing && stream.previewUrl && (
          <video
            src={stream.previewUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 rounded">
          {formatDuration(stream.duration)}
        </span>
      </div>
      <div className="flex gap-2">
        <img
          src={stream.channelAvatar || undefined}
          alt={stream.channelName}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
            {stream.title}
          </p>
          <p className="text-xs text-zinc-400">{stream.channelName}</p>
          <p className="text-xs text-zinc-500">
            {formatViews(stream.views)} · {stream.uploadDate}
          </p>
        </div>
      </div>
    </Link>
  );
}
