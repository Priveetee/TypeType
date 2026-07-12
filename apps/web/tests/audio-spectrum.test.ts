import { expect, test } from "bun:test";
import { waveformLevel } from "../src/lib/audio-spectrum";

test("mirrors frequency samples across the waveform", () => {
  const data = new Uint8Array([255, 128, 64, 32, 0]);
  const levels = Array.from({ length: 7 }, (_, index) => waveformLevel(data, index, 7));

  expect(levels[0]).toBe(levels[6]);
  expect(levels[1]).toBe(levels[5]);
  expect(levels[2]).toBe(levels[4]);
  expect(levels[3]).toBeGreaterThan(levels[0] ?? 0);
});

test("returns silence when waveform data is unavailable", () => {
  expect(waveformLevel(new Uint8Array(), 0, 1)).toBe(0);
});
