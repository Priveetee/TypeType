import type {
  AudioStreamItem,
  PreviewFrameItem,
  SponsorBlockSegmentItem,
  SubtitleItem,
  VideoStreamItem,
} from "./api";

export type VideoStream = {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  channelName: string;
  channelUrl?: string;
  channelAvatar: string;
  uploaderVerified?: boolean;
  uploaderSubscriberCount?: number;
  views: number;
  duration: number;
  uploadDate: string;
  uploaded?: number;
  likes?: number;
  dislikes?: number;
  livestream?: boolean;
  hlsUrl?: string;
  tags?: string[];
  category?: string;
  related?: VideoStream[];
  videoOnlyStreams?: VideoStreamItem[];
  audioStreams?: AudioStreamItem[];
  subtitles?: SubtitleItem[];
  previewFrames?: PreviewFrameItem[];
  sponsorBlockSegments?: SponsorBlockSegmentItem[];
};
