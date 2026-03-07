export type VideoStreamItem = {
  url: string;
  format: "MPEG_4" | "WEBM" | "v3GPP";
  resolution: string;
  bitrate: number | null;
  codec: string;
  isVideoOnly: boolean;
};

export type AudioStreamItem = {
  url: string;
  format: string;
  bitrate: number | null;
  codec: string;
  quality: string | null;
};

export type SponsorBlockSegmentItem = {
  startTime: number;
  endTime: number;
  category: string;
  action: string;
};

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  uploaderName: string;
  uploaderUrl: string;
  uploaderAvatarUrl: string;
  duration: number;
  viewCount: number;
  uploadDate: string;
};

export type StreamResponse = {
  id: string;
  title: string;
  uploaderName: string;
  uploaderUrl: string;
  thumbnailUrl: string;
  description: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  uploadDate: string;
  hlsUrl: string;
  dashMpdUrl: string;
  videoStreams: VideoStreamItem[];
  audioStreams: AudioStreamItem[];
  videoOnlyStreams: VideoStreamItem[];
  sponsorBlockSegments: SponsorBlockSegmentItem[];
  relatedStreams: VideoItem[];
};

export type SearchPageResponse = {
  items: VideoItem[];
  nextpage: string | null;
};

export type CommentItem = {
  id: string;
  text: string;
  author: string;
  authorUrl: string;
  authorAvatarUrl: string;
  likeCount: number;
  publishedTime: string;
  isHeartedByUploader: boolean;
  isPinned: boolean;
};

export type CommentsPageResponse = {
  comments: CommentItem[];
  nextpage: string | null;
};

export type ChannelResponse = {
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriberCount: number;
  isVerified: boolean;
  videos: VideoItem[];
  nextpage: string | null;
};
