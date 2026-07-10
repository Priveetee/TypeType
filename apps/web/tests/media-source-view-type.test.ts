import { expect, test } from "bun:test";
import { adaptiveSourceNeedsVideoProvider } from "../src/lib/media-source-view-type";

test("uses a video provider for adaptive audio manifests", () => {
  expect(
    adaptiveSourceNeedsVideoProvider({ src: "/audio.m3u8", type: "application/x-mpegurl" }),
  ).toBe(true);
  expect(adaptiveSourceNeedsVideoProvider({ src: "/audio.m4a", type: "audio/mp4" })).toBe(false);
});
