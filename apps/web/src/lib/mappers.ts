import type { CommentItem, StreamResponse, VideoItem } from "../types/api";
import type { Comment } from "../types/comment";
import type { VideoStream } from "../types/stream";

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
  return {
    id: url,
    title: response.title,
    thumbnail: response.thumbnailUrl,
    channelName: response.uploaderName,
    channelUrl: response.uploaderUrl || undefined,
    channelAvatar: response.uploaderAvatarUrl,
    views: response.viewCount,
    duration: response.duration,
    uploadDate: response.uploadDate,
    description: response.description || undefined,
    likes: response.likeCount,
    dislikes: response.dislikeCount === -1 ? undefined : response.dislikeCount,
    related: response.relatedStreams.map(mapVideoItem),
  };
}
