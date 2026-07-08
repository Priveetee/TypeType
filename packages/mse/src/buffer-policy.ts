import type { TypeTypeMseConfig } from "./types";

export type BufferPolicy = {
  bufferGoalMs: number;
  backBufferMs: number;
  pollIntervalMs: number;
  manifestRefreshMs: number;
  manifestPollLimit: number;
  segmentPollLimit: number;
};

export function resolveBufferPolicy(config: TypeTypeMseConfig): BufferPolicy {
  return {
    bufferGoalMs: positive(config.bufferGoalMs, 30_000),
    backBufferMs: positive(config.backBufferMs, 30_000),
    pollIntervalMs: positive(config.pollIntervalMs, 500),
    manifestRefreshMs: positive(config.manifestRefreshMs, 8_000),
    manifestPollLimit: integer(config.manifestPollLimit, 60),
    segmentPollLimit: integer(config.segmentPollLimit, 60),
  };
}

function positive(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function integer(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
