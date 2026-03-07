import type { AudioStreamItem, VideoStreamItem } from "./api";

export type VideoStream = {
  id: string;
  title: string;
  thumbnail: string;
  previewUrl?: string;
  description?: string;
  channelName: string;
  channelUrl?: string;
  channelAvatar: string;
  views: number;
  duration: number;
  uploadDate: string;
  likes?: number;
  dislikes?: number;
  livestream?: boolean;
  hlsUrl?: string;
  related?: VideoStream[];
  videoOnlyStreams?: VideoStreamItem[];
  audioStreams?: AudioStreamItem[];
};
