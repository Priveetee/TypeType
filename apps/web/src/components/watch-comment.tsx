import { useState } from "react";
import type { Comment } from "../types/comment";

type Props = {
  comment: Comment;
  depth?: number;
};

function formatLikes(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatAge(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function WatchComment({ comment, depth = 0 }: Props) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={depth > 0 ? "ml-10" : ""}>
      <div className="flex gap-3">
        <img
          src={comment.avatar}
          alt={comment.author}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-300">{comment.author}</span>
            <span className="text-xs text-zinc-500">{formatAge(comment.postedAt)}</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed">{comment.text}</p>
          <span className="text-xs text-zinc-500">{formatLikes(comment.likes)} likes</span>
          {depth === 0 && comment.replies.length > 0 && (
            <button
              type="button"
              className="text-xs text-blue-400 hover:text-blue-300 text-left w-fit mt-1"
              onClick={() => setShowReplies((prev) => !prev)}
            >
              {showReplies
                ? "Hide replies"
                : `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>
      </div>
      {showReplies && depth === 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {comment.replies.map((reply) => (
            <WatchComment key={reply.id} comment={reply} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}
