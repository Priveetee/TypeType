import type { CommentItem, StreamResponse, VideoItem } from "../types/api";
import type { Comment } from "../types/comment";
import type { QualityStream, VideoStream } from "../types/stream";
import { proxyUrl } from "./proxy";

function mapVideoStreamItem(item: {
  url: string;
  format: string;
  resolution: string;
  bitrate: number | null;
  codec: string;
  isVideoOnly: boolean;
}): QualityStream {
  return {
    url: proxyUrl(item.url),
    format: item.format,
    resolution: item.resolution,
    bitrate: item.bitrate,
    codec: item.codec,
    isVideoOnly: item.isVideoOnly,
  };
}

export function mapVideoItem(item: VideoItem): VideoStream {
  return {
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnailUrl,
    channelName: item.uploaderName,
    channelUrl: item.uploaderUrl || undefined,
    channelAvatar: item.uploaderAvatarUrl,
    views: item.viewCount,
    duration: item.duration,
    uploadDate: item.uploadDate,
  };
}

export function mapCommentItem(item: CommentItem): Comment {
  return {
    id: item.id,
    text: item.text,
    author: item.author,
    authorUrl: item.authorUrl,
    authorAvatarUrl: item.authorAvatarUrl,
    likeCount: item.likeCount,
    publishedTime: item.publishedTime,
    isHeartedByUploader: item.isHeartedByUploader,
    isPinned: item.isPinned,
  };
}

export function mapStreamResponse(response: StreamResponse, url: string): VideoStream {
  const qualityStreams = response.videoStreams.map(mapVideoStreamItem);

  return {
    id: url,
    title: response.title,
    thumbnail: response.thumbnailUrl,
    channelName: response.uploaderName,
    channelUrl: response.uploaderUrl || undefined,
    channelAvatar: "",
    views: response.viewCount,
    duration: response.duration,
    uploadDate: response.uploadDate,
    description: response.description || undefined,
    likes: response.likeCount,
    dislikes: response.dislikeCount === -1 ? undefined : response.dislikeCount,
    hlsUrl: response.hlsUrl || undefined,
    dashMpdUrl: response.dashMpdUrl || undefined,
    qualityStreams: qualityStreams.length > 0 ? qualityStreams : undefined,
    related: response.relatedStreams.map(mapVideoItem),
  };
}
