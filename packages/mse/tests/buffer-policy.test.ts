import { expect, test } from "bun:test";
import { resolveBufferPolicy } from "../src/buffer-policy";

test("uses TypeType tuned defaults", () => {
  const policy = resolveBufferPolicy({
    endpoint: "https://example.com/api",
    videoId: "video",
    videoItag: 137,
    audioItag: 140,
    audioTrackId: null,
  });
  expect(policy.bufferGoalMs).toBe(30_000);
  expect(policy.backBufferMs).toBe(30_000);
  expect(policy.pollIntervalMs).toBe(500);
  expect(policy.manifestRefreshMs).toBe(8_000);
  expect(policy.manifestPollLimit).toBe(60);
  expect(policy.segmentPollLimit).toBe(60);
});

test("rejects invalid buffer values", () => {
  const policy = resolveBufferPolicy({
    endpoint: "https://example.com/api",
    videoId: "video",
    videoItag: 137,
    audioItag: 140,
    audioTrackId: null,
    bufferGoalMs: -1,
    backBufferMs: Number.NaN,
    pollIntervalMs: 0,
    manifestRefreshMs: 1_500,
    manifestPollLimit: 0,
    segmentPollLimit: 7,
  });
  expect(policy.bufferGoalMs).toBe(30_000);
  expect(policy.backBufferMs).toBe(30_000);
  expect(policy.pollIntervalMs).toBe(500);
  expect(policy.manifestRefreshMs).toBe(1_500);
  expect(policy.manifestPollLimit).toBe(60);
  expect(policy.segmentPollLimit).toBe(7);
});
