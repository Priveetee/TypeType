import type { QualityStream } from "../types/stream";
import { H264_STREAMS, MUXED_STREAMS } from "./quality-streams-h264";
import { AV1_STREAMS, VP9_STREAMS } from "./quality-streams-webm";

export const MOCK_QUALITY_STREAMS: QualityStream[] = [
  ...MUXED_STREAMS,
  ...H264_STREAMS,
  ...VP9_STREAMS,
  ...AV1_STREAMS,
];
