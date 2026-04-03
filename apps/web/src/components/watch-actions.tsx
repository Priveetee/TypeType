import { useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useFavoritesPlaylist } from "../hooks/use-favorites-playlist";
import { useShareUrl } from "../hooks/use-share-url";
import { useWatchLaterPlaylist } from "../hooks/use-watch-later-playlist";
import { detectProvider } from "../lib/provider";
import { goto } from "../lib/route-redirect";
import type { VideoStream } from "../types/stream";
import { DanmakuControls } from "./danmaku-controls";
import { PlaylistAddDropdown } from "./playlist-add-dropdown";
import { ReportBugModal } from "./report-bug-modal";
import { Toast } from "./toast";
import { BugIcon, ClockIcon, ListPlusIcon, ShareIcon, StarIcon } from "./watch-icons";
import { WatchMoreActions } from "./watch-more-actions";

type Props = {
  stream: VideoStream;
};
const BTN = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors";
const BTN_IDLE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";
const BTN_ON = "text-zinc-100 bg-zinc-800";

export function WatchActions({ stream }: Props) {
  const { copied, share } = useShareUrl();
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const saveAnchorRef = useRef<HTMLButtonElement>(null);
  const { isAuthed } = useAuth();
  const {
    add: addWatchLater,
    remove: removeWatchLater,
    isInWatchLater,
    isPending: wlPending,
  } = useWatchLaterPlaylist();
  const {
    add: addFavorite,
    remove: removeFavorite,
    isInFavorites,
    isPending: favPending,
  } = useFavoritesPlaylist();
  const inWatchLater = isInWatchLater(stream.id);
  const favorited = isInFavorites(stream.id);
  const isNicoNico = detectProvider(stream.id) === "nicovideo";

  function handleSaved(label: string) {
    setToastLabel(label);
    setTimeout(() => setToastLabel(null), 2000);
  }
  async function handleFavorite() {
    if (!isAuthed) {
      goto("/");
      return;
    }
    if (favorited) {
      await removeFavorite(stream.id);
      handleSaved("Removed from Favorites");
    } else {
      await addFavorite({
        url: stream.id,
        title: stream.title,
        thumbnail: stream.thumbnail,
        duration: stream.duration,
      });
      handleSaved("Saved to Favorites");
    }
  }

  async function handleWatchLater() {
    if (!isAuthed) {
      goto("/");
      return;
    }
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
      <button
        type="button"
        onClick={() => share(window.location.href)}
        className={`${BTN} ${BTN_IDLE}`}
      >
        <ShareIcon />
        Share
      </button>
      <button
        type="button"
        onClick={handleFavorite}
        disabled={favPending || !isAuthed}
        aria-pressed={favorited}
        className={`${BTN} ${favorited ? BTN_ON : BTN_IDLE} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <StarIcon filled={favorited} />
        {favPending ? "Saving..." : favorited ? "Favorited" : "Favorite"}
      </button>
      <button
        type="button"
        onClick={handleWatchLater}
        disabled={wlPending || !isAuthed}
        aria-pressed={inWatchLater}
        className={`${BTN} ${inWatchLater ? BTN_ON : BTN_IDLE} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ClockIcon />
        {wlPending ? "Saving..." : inWatchLater ? "Saved" : "Watch Later"}
      </button>
      <Toast message={copied ? "Link copied to clipboard" : toastLabel} />
      <button
        ref={saveAnchorRef}
        type="button"
        onClick={() => setPlaylistOpen((o) => !o)}
        disabled={!isAuthed}
        className={`${BTN} ${playlistOpen ? BTN_ON : BTN_IDLE}`}
      >
        <ListPlusIcon />
        Save
      </button>
      <WatchMoreActions
        stream={stream}
        isAuthed={isAuthed}
        onSaved={handleSaved}
        className={`${BTN} ${BTN_IDLE}`}
      />
      {isNicoNico && <DanmakuControls />}
      {isAuthed && (
        <button type="button" onClick={() => setReportOpen(true)} className={`${BTN} ${BTN_IDLE}`}>
          <BugIcon />
          Report
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
      {reportOpen && <ReportBugModal videoUrl={stream.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
