export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  postedAt: Date;
  replies: Comment[];
};
