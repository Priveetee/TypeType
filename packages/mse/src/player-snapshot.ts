import type { LoadedSession } from "./session-loader";
import type { TypeTypeMseState } from "./types";

export type TypeTypeMseSnapshot = {
  state: TypeTypeMseState;
  sessionId: string | null;
  generation: number | null;
  currentTimeMs: number;
  bufferedEndMs: number;
};

export function createSnapshot(
  video: HTMLVideoElement,
  state: TypeTypeMseState,
  session: LoadedSession | null,
): TypeTypeMseSnapshot {
  return {
    state,
    sessionId: session?.response.sessionId ?? null,
    generation: session?.response.generation ?? null,
    currentTimeMs: Math.max(0, Math.round(video.currentTime * 1000)),
    bufferedEndMs: bufferedEndMs(video),
  };
}

export function bufferedEndMs(video: HTMLVideoElement): number {
  const buffered = video.buffered;
  if (buffered.length === 0) return 0;
  return Math.round(buffered.end(buffered.length - 1) * 1000);
}

export function currentTimeMs(video: HTMLVideoElement): number {
  return Math.max(0, Math.round(video.currentTime * 1000));
}
