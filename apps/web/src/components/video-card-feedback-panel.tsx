import { useAuth } from "../hooks/use-auth";
import { useBlocked } from "../hooks/use-blocked";
import { sendRecommendationFeedback } from "../lib/recommendation-tracker";
import { goto } from "../lib/route-redirect";
import type { VideoStream } from "../types/stream";
import { RecommendationFeedbackDropdown } from "./recommendation-feedback-dropdown";

type Props = {
  stream: VideoStream;
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export function VideoCardFeedbackPanel({ stream, anchorEl, onClose }: Props) {
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
    <RecommendationFeedbackDropdown
      stream={stream}
      anchorEl={anchorEl}
      onClose={onClose}
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
  );
}
