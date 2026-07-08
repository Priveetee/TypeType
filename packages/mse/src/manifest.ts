import type { TrackKind } from "./types";

export type ManifestSegment = {
  url: string;
  startMs: number;
  durationMs: number;
};

export type ManifestTrack = {
  kind: TrackKind;
  mime: string;
  initUrl: string;
  segments: ManifestSegment[];
};

export type PlaybackManifest = {
  durationMs: number;
  audio: ManifestTrack;
  video: ManifestTrack;
};
