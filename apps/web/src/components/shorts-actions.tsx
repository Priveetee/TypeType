import { Ban, Clock3, MessageCircle, Share2, Star, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useFavoritesPlaylist } from "../hooks/use-favorites-playlist";
import { useSettings } from "../hooks/use-settings";
import { useShareUrl } from "../hooks/use-share-url";
import { useWatchLaterPlaylist } from "../hooks/use-watch-later-playlist";
import {
  sendRecommendationFeedback,
  trackRecommendationEvent,
} from "../lib/recommendation-tracker";
import { useShortsFeedbackStore } from "../stores/shorts-feedback-store";
import type { VideoStream } from "../types/stream";
import { ShortsActionButton } from "./shorts-action-button";
import { Toast } from "./toast";

type Props = {
  stream: VideoStream;
  onOpenComments: () => void;
  className?: string;
};

export function ShortsActions({ stream, onOpenComments, className }: Props) {
  const { isAuthed } = useAuth();
  const { settings } = useSettings();
  const shortsIntent = "auto" as const;
  const { copied, share } = useShareUrl();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const hideVideo = useShortsFeedbackStore((s) => s.hideVideo);
  const hideChannel = useShortsFeedbackStore((s) => s.hideChannel);
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

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 1800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  function requireAuth(): boolean {
    if (isAuthed) return true;
    const redirect = `/shorts?v=${encodeURIComponent(stream.id)}`;
    window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`);
    return false;
  }

  async function toggleFavorite() {
    if (!requireAuth()) return;
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
    trackRecommendationEvent("favorite", stream, {
      serviceId: settings.defaultService,
      intent: shortsIntent,
    });
  }

  async function toggleWatchLater() {
    if (!requireAuth()) return;
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
    trackRecommendationEvent("watch_later_add", stream, {
      serviceId: settings.defaultService,
      intent: shortsIntent,
    });
  }

  function handleShare() {
    const watchUrl = `${window.location.origin}/watch?v=${encodeURIComponent(stream.id)}`;
    void share(watchUrl);
  }

  function markNotInterested() {
    sendRecommendationFeedback("not_interested", stream);
    hideVideo(stream.id);
    setToastMsg("Understood. We will fine-tune your Shorts.");
  }

  function showLessFromChannel() {
    if (!stream.channelUrl) return;
    sendRecommendationFeedback("less_from_channel", stream);
    hideChannel(stream.channelUrl);
    setToastMsg("Okay. We will show less from this channel.");
  }

  return (
    <div className={`relative flex flex-col items-center gap-3 ${className ?? ""}`}>
      <ShortsActionButton
        icon={Star}
        label="Favorite"
        stateLabel={favorited ? "Saved" : "Save"}
        active={favorited}
        disabled={favoritesPending}
        onClick={() => void toggleFavorite()}
      />
      <ShortsActionButton
        icon={Clock3}
        label="Watch later"
        stateLabel={watchLater ? "Saved" : "Watch Later"}
        active={watchLater}
        disabled={watchLaterPending}
        onClick={() => void toggleWatchLater()}
      />
      <ShortsActionButton icon={Ban} label="Not interested" onClick={markNotInterested} />
      <ShortsActionButton
        icon={UserMinus}
        label="Less channel"
        stateLabel="Less channel"
        onClick={showLessFromChannel}
        disabled={!stream.channelUrl}
      />
      <ShortsActionButton icon={MessageCircle} label="Comments" onClick={onOpenComments} />
      <ShortsActionButton
        icon={Share2}
        label="Share"
        stateLabel={copied ? "Copied" : "Link"}
        onClick={handleShare}
      />
      <Toast message={toastMsg} />
    </div>
  );
}
