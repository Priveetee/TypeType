export type QualityStream = {
  url: string;
  format: string;
  resolution: string;
  bitrate: number | null;
  isVideoOnly: boolean;
  codec: string;
};

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
  hlsUrl?: string;
  dashMpdUrl?: string;
  qualityStreams?: QualityStream[];
  related?: VideoStream[];
};
