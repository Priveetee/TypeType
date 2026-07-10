import { expect, test } from "bun:test";
import { frequencyLevel } from "../src/lib/audio-spectrum";

test("normalizes frequency data into waveform levels", () => {
  const data = new Uint8Array([0, 64, 128, 255]);

  expect(frequencyLevel(data, 0, 4)).toBe(0);
  expect(frequencyLevel(data, 2, 4)).toBeCloseTo(128 / 255);
  expect(frequencyLevel(data, 3, 4)).toBe(1);
});

test("returns silence when frequency data is unavailable", () => {
  expect(frequencyLevel(new Uint8Array(), 0, 1)).toBe(0);
});
