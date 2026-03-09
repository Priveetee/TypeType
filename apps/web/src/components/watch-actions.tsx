import { useRef, useState } from "react";
import { useBlocked } from "../hooks/use-blocked";
import { useFavorites } from "../hooks/use-favorites";
import { useWatchLaterPlaylist } from "../hooks/use-watch-later-playlist";
import type { VideoStream } from "../types/stream";
import { PlaylistAddDropdown } from "./playlist-add-dropdown";
import { Toast } from "./toast";
import { BanIcon, ClockIcon, ListPlusIcon, ShareIcon, StarIcon } from "./watch-icons";

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
  const {
    add: addWatchLater,
    remove: removeWatchLater,
    isInWatchLater,
    isPending: wlPending,
  } = useWatchLaterPlaylist();
  const { add: addFavorite, remove: removeFavorite, isFavorited } = useFavorites();
  const { channels: blockedChannels, addChannel, removeChannel } = useBlocked();

  const inWatchLater = isInWatchLater(stream.id);
  const favorited = isFavorited(stream.id);
  const channelBlocked =
    !!stream.channelUrl && (blockedChannels.data ?? []).some((b) => b.url === stream.channelUrl);

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

  async function handleWatchLater() {
    if (inWatchLater) {
      await removeWatchLater(stream.id);
      handleSaved("Removed from Watch Later");
    } else {
      await addWatchLater({
        url: stream.id,
        title: stream.title,
        thumbnail: stream.thumbnail,
        duration: stream.duration,
      });
      handleSaved("Saved to Watch Later");
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
        onClick={() =>
          favorited ? removeFavorite.mutate(stream.id) : addFavorite.mutate(stream.id)
        }
        aria-pressed={favorited}
        className={`${BTN} ${favorited ? BTN_ON : BTN_IDLE}`}
      >
        <StarIcon filled={favorited} />
        {favorited ? "Favorited" : "Favorite"}
      </button>
      <button
        type="button"
        onClick={handleWatchLater}
        disabled={wlPending}
        aria-pressed={inWatchLater}
        className={`${BTN} ${inWatchLater ? BTN_ON : BTN_IDLE} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ClockIcon />
        {wlPending ? "Saving..." : inWatchLater ? "Saved" : "Watch Later"}
      </button>
      <Toast message={copied ? "Link copied to clipboard" : toastLabel} />
      <button
        type="button"
        onClick={() => setPlaylistOpen((o) => !o)}
        className={`${BTN} ${playlistOpen ? BTN_ON : BTN_IDLE}`}
      >
        <ListPlusIcon />
        Save
      </button>
      {stream.channelUrl && (
        <button
          type="button"
          onClick={() => {
            const cu = stream.channelUrl;
            if (!cu) return;
            if (channelBlocked) removeChannel.mutate(cu);
            else addChannel.mutate(cu);
          }}
          aria-pressed={channelBlocked}
          className={`${BTN} ${channelBlocked ? BTN_ON : BTN_IDLE}`}
        >
          <BanIcon />
          {channelBlocked ? "Unblock channel" : "Block channel"}
        </button>
      )}
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
