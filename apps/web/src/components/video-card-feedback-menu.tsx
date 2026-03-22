import { useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useBlocked } from "../hooks/use-blocked";
import { sendRecommendationFeedback } from "../lib/recommendation-tracker";
import { goto } from "../lib/route-redirect";
import type { VideoStream } from "../types/stream";
import { RecommendationFeedbackDropdown } from "./recommendation-feedback-dropdown";
import { MoreIcon } from "./watch-icons";

type Props = {
  stream: VideoStream;
};

export function VideoCardFeedbackMenu({ stream }: Props) {
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthed } = useAuth();
  const { channels, videos, addChannel, removeChannel, addVideo, removeVideo } = useBlocked();
  const channelBlocked =
    !!stream.channelUrl &&
    (channels.data ?? []).some((blocked) => blocked.url === stream.channelUrl);
  const videoBlocked = (videos.data ?? []).some((blocked) => blocked.url === stream.id);

  function requireAuth(): boolean {
    if (isAuthed) return false;
    goto("/");
    return true;
  }

  function toggleVideoBlock() {
    if (requireAuth()) return;
    if (videoBlocked) {
      removeVideo.mutate(stream.id);
      return;
    }
    addVideo.mutate({ url: stream.id, global: false });
  }

  function toggleChannelBlock() {
    if (!stream.channelUrl || requireAuth()) return;
    if (channelBlocked) {
      removeChannel.mutate(stream.channelUrl);
      return;
    }
    addChannel.mutate({
      url: stream.channelUrl,
      name: stream.channelName,
      thumbnailUrl: stream.channelAvatar,
      global: false,
    });
  }

  return (
    <>
      <button
        ref={menuRef}
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        aria-label="Recommendation options"
      >
        <MoreIcon />
      </button>
      {menuOpen && (
        <RecommendationFeedbackDropdown
          stream={stream}
          anchorEl={menuRef.current}
          onClose={() => setMenuOpen(false)}
          onNotInterested={() =>
            sendRecommendationFeedback("not_interested", {
              id: stream.id,
              channelUrl: stream.channelUrl,
            })
          }
          onLessFromChannel={
            stream.channelUrl
              ? () =>
                  sendRecommendationFeedback("less_from_channel", {
                    id: stream.id,
                    channelUrl: stream.channelUrl,
                  })
              : undefined
          }
          onToggleVideoBlock={toggleVideoBlock}
          onToggleChannelBlock={stream.channelUrl ? toggleChannelBlock : undefined}
          videoBlocked={videoBlocked}
          channelBlocked={channelBlocked}
        />
      )}
    </>
  );
}
