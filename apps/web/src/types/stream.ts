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
};
