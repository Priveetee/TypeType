import type { Comment } from "../types/comment";
import { WatchCommentRow } from "./watch-comment-row";

type Props = {
  comments: Comment[];
  videoUrl: string;
};

export function WatchCommentsList({ comments, videoUrl }: Props) {
  return comments.map((comment, i) => (
    <WatchCommentRow key={comment.id || `c-${i}`} comment={comment} videoUrl={videoUrl} index={i} />
  ));
}
