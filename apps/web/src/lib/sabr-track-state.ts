import type { SabrFormatDescriptor, SabrRequestMessage } from "../types/sabr";
import { type SabrTrackState, sequenceFor } from "./sabr-mse-utils";
import { SabrSourceBufferQueue } from "./sabr-source-buffer-queue";

export type SabrTrackName = "audio" | "video";

export function createSabrTrack(
  source: MediaSource,
  format: SabrFormatDescriptor,
  currentTimeMs: number,
): SabrTrackState {
  return {
    format,
    queue: new SabrSourceBufferQueue(source.addSourceBuffer(format.mimeType)),
    nextSequence: sequenceFor(format, currentTimeMs),
  };
}

export function setSabrTrackSequence(track: SabrTrackState, timeMs: number): void {
  track.nextSequence = sequenceFor(track.format, timeMs);
}

export function sabrInitRequest(
  trackName: SabrTrackName,
  track: SabrTrackState,
  generation: number,
  playerTimeMs: number,
): SabrRequestMessage {
  return {
    type: "init",
    requestId: `${trackName}-init-${generation}`,
    itag: track.format.itag,
    playerTimeMs,
    videoActive: trackName === "video",
    audioActive: trackName === "audio",
  };
}

export function sabrSegmentRequest(
  trackName: SabrTrackName,
  track: SabrTrackState,
  generation: number,
  playerTimeMs: number,
): SabrRequestMessage {
  return {
    type: "pump",
    requestId: `${trackName}-${generation}-${track.nextSequence}`,
    itag: track.format.itag,
    sequence: track.nextSequence,
    playerTimeMs,
    videoActive: trackName === "video",
    audioActive: trackName === "audio",
  };
}
