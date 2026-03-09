import { useRef, useState } from "react";
import { useWatchLater } from "../hooks/use-watch-later";
import type { VideoStream } from "../types/stream";
import { PlaylistAddDropdown } from "./playlist-add-dropdown";
import { Toast } from "./toast";
import { ClockIcon, ListPlusIcon, ShareIcon } from "./watch-icons";

type Props = {
  stream: VideoStream;
};

const BTN = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors";
const BTN_IDLE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";
const BTN_ON = "text-zinc-100 bg-zinc-800";

export function WatchActions({ stream }: Props) {
  const [copied, setCopied] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const saveAnchorRef = useRef<HTMLButtonElement>(null);
  const { add: addWatchLater, remove: removeWatchLater, videos: wlVideos } = useWatchLater();

  const inWatchLater = wlVideos.some((w) => w.url === stream.id);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function handleSaved(label: string) {
    setToastLabel(label);
    setTimeout(() => setToastLabel(null), 2000);
  }

  function handleWatchLater() {
    if (inWatchLater) {
      removeWatchLater.mutate(stream.id);
    } else {
      addWatchLater.mutate({
        url: stream.id,
        title: stream.title,
        thumbnail: stream.thumbnail,
        duration: stream.duration,
      });
    }
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <button type="button" onClick={handleShare} className={`${BTN} ${BTN_IDLE}`}>
        <ShareIcon />
        Share
      </button>
      <button
        type="button"
        onClick={handleWatchLater}
        aria-pressed={inWatchLater}
        className={`${BTN} ${inWatchLater ? BTN_ON : BTN_IDLE}`}
      >
        <ClockIcon />
        {inWatchLater ? "Saved" : "Watch Later"}
      </button>
      <Toast message={copied ? "Link copied to clipboard" : toastLabel} />
      <button
        ref={saveAnchorRef}
        type="button"
        onClick={() => setPlaylistOpen((o) => !o)}
        className={`${BTN} ${playlistOpen ? BTN_ON : BTN_IDLE}`}
      >
        <ListPlusIcon />
        Save
      </button>
      {playlistOpen && (
        <PlaylistAddDropdown
          stream={stream}
          anchorEl={saveAnchorRef.current}
          onClose={() => setPlaylistOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
