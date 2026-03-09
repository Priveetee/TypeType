import type {
  AudioStreamItem,
  PreviewFrameItem,
  SponsorBlockSegmentItem,
  StreamSegmentItem,
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
  streamType?: string;
  isShortFormContent?: boolean;
  requiresMembership?: boolean;
  startPosition?: number;
  streamSegments?: StreamSegmentItem[];
  hlsUrl?: string;
  tags?: string[];
  category?: string;
  shortDescription?: string;
  related?: VideoStream[];
  videoOnlyStreams?: VideoStreamItem[];
  audioStreams?: AudioStreamItem[];
  subtitles?: SubtitleItem[];
  previewFrames?: PreviewFrameItem[];
  sponsorBlockSegments?: SponsorBlockSegmentItem[];
};
