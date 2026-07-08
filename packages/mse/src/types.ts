export type TrackKind = "audio" | "video";

export type TypeTypeMseState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "seeking"
  | "buffering"
  | "ended"
  | "error"
  | "destroyed";

export type TypeTypeMseConfig = {
  endpoint: string;
  videoId: string;
  videoItag: number;
  audioItag: number;
  audioTrackId: string | null;
  startTimeMs?: number;
  headers?: HeadersInit;
  bufferGoalMs?: number;
  backBufferMs?: number;
  pollIntervalMs?: number;
  manifestRefreshMs?: number;
  manifestPollLimit?: number;
  segmentPollLimit?: number;
};

export type TypeTypeMseQuality = {
  videoItag: number;
  audioItag?: number;
  audioTrackId?: string | null;
};

export type TypeTypeMseEvent =
  | { type: "state"; state: TypeTypeMseState }
  | { type: "manifest"; generation: number | null; segmentCount: number }
  | { type: "quality"; videoItag: number; audioItag: number | null }
  | { type: "segment"; kind: TrackKind; url: string; startMs: number; durationMs: number }
  | { type: "buffer"; bufferedEndMs: number; currentTimeMs: number }
  | { type: "seek"; positionMs: number }
  | { type: "error"; error: Error };

export type TypeTypeMseEventType = TypeTypeMseEvent["type"];

export type TypeTypeMseListener = (event: TypeTypeMseEvent) => void;
