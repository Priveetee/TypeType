export type QualityStream = {
  url: string;
  format: "MPEG_4" | "WEBM" | "v3GPP";
  resolution: string;
  bitrate: number;
  isVideoOnly: boolean;
  codec?: string;
};

export type VideoStream = {
  id: string;
  title: string;
  thumbnail: string;
  previewUrl?: string;
  description?: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  duration: number;
  uploadedAt: Date;
  likes?: number;
  dislikes?: number;
  hlsUrl?: string;
  dashMpdUrl?: string;
  qualityStreams?: QualityStream[];
};
