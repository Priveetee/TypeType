import { useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useFavoritesPlaylist } from "../hooks/use-favorites-playlist";
import { useMobile } from "../hooks/use-mobile";
import { useShareUrl } from "../hooks/use-share-url";
import { detectProvider } from "../lib/provider";
import { goto } from "../lib/route-redirect";
import type { VideoStream } from "../types/stream";
import { DanmakuControls } from "./danmaku-controls";
import { DownloadDropdown } from "./download-dropdown";
import { DownloadSheet } from "./download-sheet";
import { PlaylistAddDropdown } from "./playlist-add-dropdown";
import { ReportBugModal } from "./report-bug-modal";
import { Toast } from "./toast";
import { WatchActionButton } from "./watch-action-button";
import { BugIcon, DownloadIcon, ListPlusIcon, ShareIcon, StarIcon } from "./watch-icons";
import { WatchMoreActions } from "./watch-more-actions";

type Props = {
  stream: VideoStream;
};
export function WatchActions({ stream }: Props) {
  const { copied, share } = useShareUrl();
  const isMobile = useMobile();
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const saveAnchorRef = useRef<HTMLButtonElement>(null);
  const downloadAnchorRef = useRef<HTMLButtonElement>(null);
  const { isAuthed } = useAuth();
  const {
    add: addFavorite,
    remove: removeFavorite,
    isInFavorites,
    isPending: favPending,
  } = useFavoritesPlaylist();
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

  function handleDownloadMock() {
    setDownloadOpen(true);
  }

  const showSave = !isMobile;
  const showReport = !isMobile;
  const showDanmaku = !isMobile && isNicoNico;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <WatchActionButton
        onClick={handleFavorite}
        disabled={favPending || !isAuthed}
        pressed={favorited}
        active={favorited}
      >
        <StarIcon filled={favorited} />
        {favPending ? "Saving..." : favorited ? "Favorited" : "Favorite"}
      </WatchActionButton>
      <WatchActionButton buttonRef={downloadAnchorRef} onClick={handleDownloadMock}>
        <DownloadIcon />
        Download
      </WatchActionButton>
      <WatchActionButton onClick={() => share(window.location.href)}>
        <ShareIcon />
        Share
      </WatchActionButton>
      <Toast message={copied ? "Link copied to clipboard" : toastLabel} />
      {showSave && (
        <button
          ref={saveAnchorRef}
          type="button"
          onClick={() => setPlaylistOpen((o) => !o)}
          disabled={!isAuthed}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            playlistOpen
              ? "text-zinc-100 bg-zinc-800"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <ListPlusIcon />
          Save
        </button>
      )}
      <WatchMoreActions
        stream={stream}
        isAuthed={isAuthed}
        onSaved={handleSaved}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
      />
      {showDanmaku && <DanmakuControls />}
      {showReport && isAuthed && (
        <WatchActionButton onClick={() => setReportOpen(true)}>
          <BugIcon />
          Report
        </WatchActionButton>
      )}
      {playlistOpen && (
        <PlaylistAddDropdown
          stream={stream}
          anchorEl={saveAnchorRef.current}
          onClose={() => setPlaylistOpen(false)}
          onSaved={handleSaved}
        />
      )}
      {downloadOpen &&
        (isMobile ? (
          <DownloadSheet
            stream={stream}
            onClose={() => setDownloadOpen(false)}
            onDone={(message) => handleSaved(message)}
          />
        ) : (
          <DownloadDropdown
            stream={stream}
            anchorEl={downloadAnchorRef.current}
            onClose={() => setDownloadOpen(false)}
            onDone={(message) => handleSaved(message)}
          />
        ))}
      {reportOpen && <ReportBugModal videoUrl={stream.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
