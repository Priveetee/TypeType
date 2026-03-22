import { useRef, useState } from "react";
import { useBlocked } from "../hooks/use-blocked";
import { sendRecommendationFeedback } from "../lib/recommendation-tracker";
import { goto } from "../lib/route-redirect";
import type { VideoStream } from "../types/stream";
import { RecommendationFeedbackDropdown } from "./recommendation-feedback-dropdown";
import { MoreIcon } from "./watch-icons";

type Props = {
  stream: VideoStream;
  isAuthed: boolean;
  onSaved: (label: string) => void;
  className: string;
};

export function WatchMoreActions({ stream, isAuthed, onSaved, className }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const { channels, videos, addChannel, removeChannel, addVideo, removeVideo } = useBlocked();
  const channelBlocked =
    !!stream.channelUrl &&
    (channels.data ?? []).some((blocked) => blocked.url === stream.channelUrl);
  const videoBlocked = (videos.data ?? []).some((blocked) => blocked.url === stream.id);

  function ensureAuth(): boolean {
    if (isAuthed) return true;
    goto("/");
    return false;
  }

  function toggleVideoBlock() {
    if (!ensureAuth()) return;
    if (videoBlocked) {
      removeVideo.mutate(stream.id);
      onSaved("Video unblocked");
      return;
    }
    addVideo.mutate({ url: stream.id, global: false });
    onSaved("Video blocked");
  }

  function toggleChannelBlock() {
    if (!stream.channelUrl || !ensureAuth()) return;
    if (channelBlocked) {
      removeChannel.mutate(stream.channelUrl);
      onSaved("Channel unblocked");
      return;
    }
    addChannel.mutate({
      url: stream.channelUrl,
      name: stream.channelName,
      thumbnailUrl: stream.channelAvatar,
      global: false,
    });
    onSaved(`Channel blocked: ${stream.channelName}`);
  }

  function handleNotInterested() {
    sendRecommendationFeedback("not_interested", { id: stream.id, channelUrl: stream.channelUrl });
    onSaved("We'll show fewer videos like this");
  }

  function handleLessFromChannel() {
    if (!stream.channelUrl) return;
    sendRecommendationFeedback("less_from_channel", {
      id: stream.id,
      channelUrl: stream.channelUrl,
    });
    onSaved(`We'll show less from ${stream.channelName}`);
  }

  return (
    <>
      <button
        ref={menuAnchorRef}
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className={className}
      >
        <MoreIcon />
        More
      </button>
      {menuOpen && (
        <RecommendationFeedbackDropdown
          stream={stream}
          anchorEl={menuAnchorRef.current}
          onClose={() => setMenuOpen(false)}
          onNotInterested={handleNotInterested}
          onLessFromChannel={stream.channelUrl ? handleLessFromChannel : undefined}
          onToggleVideoBlock={toggleVideoBlock}
          onToggleChannelBlock={stream.channelUrl ? toggleChannelBlock : undefined}
          videoBlocked={videoBlocked}
          channelBlocked={channelBlocked}
        />
      )}
    </>
  );
}
