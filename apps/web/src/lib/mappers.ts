import type { CommentItem, StreamResponse, VideoItem } from "../types/api";
import type { Comment } from "../types/comment";
import type { VideoStream } from "../types/stream";
import { proxyImage } from "./proxy";

function normalizeDescription(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function mapVideoItem(item: VideoItem): VideoStream {
  const canonicalUrl = item.url.trim().length > 0 ? item.url : item.id;
  return {
    id: canonicalUrl,
    title: item.title,
    thumbnail: proxyImage(item.thumbnailUrl),
    rawThumbnail: item.thumbnailUrl,
    rawChannelAvatar: item.uploaderAvatarUrl,
    channelName: item.uploaderName,
    channelUrl: item.uploaderUrl || undefined,
    channelAvatar: proxyImage(item.uploaderAvatarUrl),
    uploaderVerified: item.uploaderVerified,
    views: item.viewCount,
    duration: item.duration,
    uploadDate: item.uploadDate || undefined,
    uploaded: item.uploaded > 0 ? item.uploaded : undefined,
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
    authorAvatarUrl: proxyImage(item.authorAvatarUrl),
    likeCount: item.likeCount,
    textualLikeCount: item.textualLikeCount,
    publishedTime: item.publishedTime,
    publishedAt: item.publishedAt ?? null,
    isHeartedByUploader: item.isHeartedByUploader,
    isPinned: item.isPinned,
    uploaderVerified: item.uploaderVerified,
    replyCount: item.replyCount,
    repliesPage: item.repliesPage ?? null,
  };
}

export function mapStreamResponse(response: StreamResponse, url: string): VideoStream {
  const rawDescription = response.description || undefined;
  const description = rawDescription ? normalizeDescription(rawDescription) : undefined;

  return {
    id: url,
    title: response.title,
    thumbnail: proxyImage(response.thumbnailUrl),
    rawThumbnail: response.thumbnailUrl,
    rawChannelAvatar: response.uploaderAvatarUrl,
    channelName: response.uploaderName,
    channelUrl: response.uploaderUrl || undefined,
    channelAvatar: proxyImage(response.uploaderAvatarUrl),
    uploaderVerified: response.uploaderVerified,
    uploaderSubscriberCount:
      response.uploaderSubscriberCount >= 0 ? response.uploaderSubscriberCount : undefined,
    views: response.viewCount,
    duration: response.duration,
    uploadDate: response.uploadDate || undefined,
    uploaded: response.uploaded <= 0 ? undefined : response.uploaded,
    description,
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
