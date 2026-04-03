import { Bug, Clock3, MessageCircle, Share2, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useFavoritesPlaylist } from "../hooks/use-favorites-playlist";
import { useShareUrl } from "../hooks/use-share-url";
import { useWatchLaterPlaylist } from "../hooks/use-watch-later-playlist";
import type { VideoStream } from "../types/stream";
import { ReportBugModal } from "./report-bug-modal";

type Props = {
  stream: VideoStream;
  onOpenComments: () => void;
  className?: string;
};

export function ShortsActions({ stream, onOpenComments, className }: Props) {
  const { isAuthed } = useAuth();
  const { copied, share } = useShareUrl();
  const [reportOpen, setReportOpen] = useState(false);
  const {
    add: addFavorite,
    remove: removeFavorite,
    isInFavorites,
    isPending: favoritesPending,
  } = useFavoritesPlaylist();
  const {
    add: addWatchLater,
    remove: removeWatchLater,
    isInWatchLater,
    isPending: watchLaterPending,
  } = useWatchLaterPlaylist();

  const favorited = isInFavorites(stream.id);
  const watchLater = isInWatchLater(stream.id);

  async function toggleFavorite() {
    if (!isAuthed) {
      const redirect = `/shorts?v=${encodeURIComponent(stream.id)}`;
      window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    if (favorited) {
      await removeFavorite(stream.id);
      return;
    }
    await addFavorite({
      url: stream.id,
      title: stream.title,
      thumbnail: stream.thumbnail,
      duration: stream.duration,
    });
  }

  async function toggleWatchLater() {
    if (!isAuthed) {
      const redirect = `/shorts?v=${encodeURIComponent(stream.id)}`;
      window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    if (watchLater) {
      await removeWatchLater(stream.id);
      return;
    }
    await addWatchLater({
      url: stream.id,
      title: stream.title,
      thumbnail: stream.thumbnail,
      duration: stream.duration,
    });
  }

  function handleShare() {
    const watchUrl = `${window.location.origin}/watch?v=${encodeURIComponent(stream.id)}`;
    void share(watchUrl);
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <ActionButton
        icon={Star}
        label="Favorite"
        stateLabel={favorited ? "Saved" : "Save"}
        active={favorited}
        disabled={favoritesPending}
        onClick={() => void toggleFavorite()}
      />
      <ActionButton
        icon={Clock3}
        label="Watch later"
        stateLabel={watchLater ? "Saved" : "Watch Later"}
        active={watchLater}
        disabled={watchLaterPending}
        onClick={() => void toggleWatchLater()}
      />
      <ActionButton icon={MessageCircle} label="Comments" onClick={onOpenComments} />
      <ActionButton
        icon={Share2}
        label="Share"
        stateLabel={copied ? "Copied" : "Link"}
        onClick={handleShare}
      />
      {isAuthed && (
        <ActionButton
          icon={Bug}
          label="Report bug"
          stateLabel="Report"
          onClick={() => setReportOpen(true)}
        />
      )}
      {reportOpen && <ReportBugModal videoUrl={stream.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}

type ActionButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  stateLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function ActionButton({
  icon: Icon,
  label,
  stateLabel,
  active,
  disabled,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 text-white/90 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-zinc-200/80 bg-zinc-100 text-zinc-900"
            : "border-zinc-700/80 bg-zinc-900/80 hover:border-zinc-500 hover:bg-zinc-800"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-[11px] leading-tight text-white/90">{stateLabel ?? label}</span>
    </button>
  );
}
