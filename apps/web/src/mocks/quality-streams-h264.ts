import type { QualityStream } from "../types/stream";

const URL = "https://files.vidstack.io/sprite-fight/720p.mp4";

export const MUXED_STREAMS: QualityStream[] = [
  {
    url: URL,
    format: "MPEG_4",
    resolution: "360p",
    bitrate: 500000,
    isVideoOnly: false,
    codec: "avc1.42001e",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "480p",
    bitrate: 1000000,
    isVideoOnly: false,
    codec: "avc1.4d001f",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "720p",
    bitrate: 2500000,
    isVideoOnly: false,
    codec: "avc1.4d001f",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "1080p",
    bitrate: 4500000,
    isVideoOnly: false,
    codec: "avc1.64002a",
  },
];

export const H264_STREAMS: QualityStream[] = [
  {
    url: URL,
    format: "MPEG_4",
    resolution: "144p",
    bitrate: 102000,
    isVideoOnly: true,
    codec: "avc1.4d400c",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "240p",
    bitrate: 242000,
    isVideoOnly: true,
    codec: "avc1.4d4015",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "360p",
    bitrate: 491000,
    isVideoOnly: true,
    codec: "avc1.4d401e",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "480p",
    bitrate: 985000,
    isVideoOnly: true,
    codec: "avc1.4d401f",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "720p",
    bitrate: 2473000,
    isVideoOnly: true,
    codec: "avc1.4d401f",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "720p60",
    bitrate: 3654000,
    isVideoOnly: true,
    codec: "avc1.4d4020",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "1080p",
    bitrate: 4447000,
    isVideoOnly: true,
    codec: "avc1.64002a",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "1080p60",
    bitrate: 6133000,
    isVideoOnly: true,
    codec: "avc1.64002a",
  },
  {
    url: URL,
    format: "MPEG_4",
    resolution: "2160p",
    bitrate: 15000000,
    isVideoOnly: true,
    codec: "avc1.640033",
  },
];
