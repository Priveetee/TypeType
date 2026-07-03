import type { SabrFormatDescriptor, SabrMediaChunk } from "../types/sabr";
import type { SabrSourceBufferQueue } from "./sabr-source-buffer-queue";

export type SabrTrackState = {
  format: SabrFormatDescriptor;
  queue: SabrSourceBufferQueue;
  nextSequence: number;
};

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function waitForSourceOpen(source: MediaSource): Promise<void> {
  if (source.readyState === "open") return Promise.resolve();
  return new Promise((resolve, reject) => {
    source.addEventListener("sourceopen", () => resolve(), { once: true });
    source.addEventListener("error", () => reject(new Error("media_source_error")), { once: true });
  });
}

export function bufferedAhead(media: HTMLMediaElement): number {
  const time = media.currentTime;
  for (let i = 0; i < media.buffered.length; i += 1) {
    const start = media.buffered.start(i);
    const end = media.buffered.end(i);
    if (time >= start - 0.25 && time <= end) return Math.max(0, end - time);
  }
  return 0;
}

export function sequenceFor(format: SabrFormatDescriptor, timeMs: number): number {
  const segmentMs = format.approxDurationMs / Math.max(1, format.endSegment);
  const sequence = Math.floor(Math.max(0, timeMs) / Math.max(1, segmentMs)) + 1;
  return Math.min(format.endSegment, Math.max(1, sequence));
}

export function appendChunks(track: SabrTrackState, chunks: SabrMediaChunk[]): void {
  for (const chunk of chunks) {
    if (chunk.metadata.itag !== track.format.itag) continue;
    track.queue.append(chunk.bytes);
    if (!chunk.metadata.init) track.nextSequence = chunk.metadata.sequence + 1;
  }
}
