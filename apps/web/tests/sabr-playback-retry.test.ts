import { expect, test } from "bun:test";
import type { TypeTypeMsePlayer } from "@typetype/mse";
import { playWithMuteFallback } from "../src/lib/sabr-playback-retry";

test("keeps autoplay muted after an audible play rejection", async () => {
  let attempts = 0;
  const player = {
    play: () => {
      attempts += 1;
      return attempts === 1 ? Promise.reject(new Error("NotAllowedError")) : Promise.resolve();
    },
  } as TypeTypeMsePlayer;
  const video = { muted: false } as HTMLVideoElement;

  await playWithMuteFallback(player, video);

  expect(attempts).toBe(2);
  expect(video.muted).toBe(true);
});
