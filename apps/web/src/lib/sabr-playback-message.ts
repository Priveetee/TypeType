import type { SabrRequestMessage } from "../types/sabr";
import type { SabrTrackState } from "./sabr-mse-utils";

export function sabrPlayerTimeMs(media: HTMLMediaElement): number {
  return Math.max(0, Math.round(media.currentTime * 1000));
}

function sabrPlaybackRate(media: HTMLMediaElement): number {
  const rate = media.playbackRate;
  return Number.isFinite(rate) && rate > 0 ? rate : 1;
}

export function sabrPlaybackMessage(
  type: "state" | "pump",
  requestId: string,
  media: HTMLMediaElement,
  video: SabrTrackState,
  audio: SabrTrackState,
  playerTimeMs = sabrPlayerTimeMs(media),
): SabrRequestMessage {
  return {
    type,
    requestId,
    videoItag: video.format.itag,
    audioItag: audio.format.itag,
    playerTimeMs,
    playbackRate: sabrPlaybackRate(media),
    videoActive: true,
    audioActive: true,
  };
}
