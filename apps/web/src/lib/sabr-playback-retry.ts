import type { TypeTypeMsePlayer } from "@typetype/mse";

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
}

export async function playWithMuteFallback(
  player: TypeTypeMsePlayer,
  video: HTMLVideoElement,
): Promise<void> {
  try {
    await player.play();
    return;
  } catch (error) {
    if (isAbortError(error)) throw error;
  }
  const muted = video.muted;
  video.muted = true;
  try {
    await player.play();
  } finally {
    video.muted = muted;
  }
}
