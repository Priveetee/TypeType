import { useState } from "react";
import { formatLikes } from "../lib/format";
import type { Comment } from "../types/comment";
import { RichText } from "./rich-text";
import { WatchCommentReplies } from "./watch-comment-replies";

type Props = {
  comment: Comment;
  videoUrl: string;
};

export function WatchComment({ comment, videoUrl }: Props) {
  const [showReplies, setShowReplies] = useState(false);

  const repliesLabel =
    comment.replyCount > 0 ? `${formatLikes(comment.replyCount)} replies` : "Show replies";

  return (
    <div className="flex gap-3">
      <img
        src={comment.authorAvatarUrl || undefined}
        alt={comment.author}
        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
      />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-zinc-300">{comment.author}</span>
          {comment.isPinned && (
            <span className="text-xs text-zinc-500 border border-zinc-700 rounded px-1">
              pinned
            </span>
          )}
          {comment.publishedTime && (
            <span className="text-xs text-zinc-500">{comment.publishedTime}</span>
          )}
        </div>
        <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
          <RichText text={comment.text} />
        </p>
        {comment.likeCount >= 0 && (
          <span className="text-xs text-zinc-500">{formatLikes(comment.likeCount)} likes</span>
        )}
        {comment.repliesPage !== null && (
          <button
            type="button"
            onClick={() => setShowReplies((v) => !v)}
            className="text-xs text-blue-400 hover:text-blue-300 text-left w-fit mt-1"
          >
            {showReplies ? "Hide replies" : repliesLabel}
          </button>
        )}
        {showReplies && comment.repliesPage !== null && (
          <WatchCommentReplies videoUrl={videoUrl} repliesPage={comment.repliesPage} />
        )}
      </div>
    </div>
  );
}
