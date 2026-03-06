import type { Comment } from "../types/comment";
import { WatchComment } from "./watch-comment";

type Props = {
  comments: Comment[];
};

export function WatchComments({ comments }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-zinc-100">{comments.length} Comments</h2>
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <WatchComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
