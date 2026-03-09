export type Comment = {
  id: string;
  text: string;
  author: string;
  authorUrl: string;
  authorAvatarUrl: string;
  likeCount: number;
  textualLikeCount: string;
  publishedTime: string;
  isHeartedByUploader: boolean;
  isPinned: boolean;
  uploaderVerified: boolean;
  replyCount: number;
  repliesPage: string | null;
};
