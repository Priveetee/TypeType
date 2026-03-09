export type Comment = {
  id: string;
  text: string;
  author: string;
  authorUrl: string;
  authorAvatarUrl: string;
  likeCount: number;
  publishedTime: string;
  isHeartedByUploader: boolean;
  isPinned: boolean;
  replyCount: number;
  repliesPage: string | null;
};
