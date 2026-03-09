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
    uploaderVerified: item.uploaderVerified,
    views: item.viewCount,
    duration: item.duration,
    uploadDate: item.uploadDate,
    streamType: item.streamType || undefined,
    isShortFormContent: item.isShortFormContent,
    shortDescription: item.shortDescription ?? undefined,
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
    textualLikeCount: item.textualLikeCount,
    publishedTime: item.publishedTime,
    isHeartedByUploader: item.isHeartedByUploader,
    isPinned: item.isPinned,
    uploaderVerified: item.uploaderVerified,
    replyCount: item.replyCount,
    repliesPage: item.repliesPage ?? null,
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
    uploaderVerified: response.uploaderVerified,
    uploaderSubscriberCount:
      response.uploaderSubscriberCount >= 0 ? response.uploaderSubscriberCount : undefined,
    views: response.viewCount,
    duration: response.duration,
    uploadDate: response.uploadDate,
    uploaded: response.uploaded <= 0 ? undefined : response.uploaded,
    description: response.description || undefined,
    likes: response.likeCount,
    dislikes: response.dislikeCount === -1 ? undefined : response.dislikeCount,
    tags: response.tags.length > 0 ? response.tags : undefined,
    category: response.category || undefined,
    related: response.relatedStreams.map(mapVideoItem),
    streamType: response.streamType || undefined,
    isShortFormContent: response.isShortFormContent,
    requiresMembership: response.requiresMembership,
    startPosition: response.startPosition > 0 ? response.startPosition : undefined,
    streamSegments: response.streamSegments.length > 0 ? response.streamSegments : undefined,
    hlsUrl: response.hlsUrl || undefined,
    videoOnlyStreams: response.videoOnlyStreams,
    audioStreams: response.audioStreams,
    subtitles: response.subtitles.length > 0 ? response.subtitles : undefined,
    previewFrames: response.previewFrames.length > 0 ? response.previewFrames : undefined,
    sponsorBlockSegments:
      response.sponsorBlockSegments.length > 0 ? response.sponsorBlockSegments : undefined,
  };
}
