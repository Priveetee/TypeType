import { useLayoutEffect, useRef, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight);
  }, []);

  const repliesLabel =
    comment.replyCount > 0 ? `${formatLikes(comment.replyCount)} replies` : "Show replies";

  const likeDisplay = comment.textualLikeCount || formatLikes(comment.likeCount);

  return (
    <div className="flex gap-3">
      {comment.authorAvatarUrl ? (
        <img
          src={comment.authorAvatarUrl}
          alt={comment.author}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 bg-zinc-700"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 bg-zinc-700" />
      )}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-zinc-300">{comment.author}</span>
          {comment.uploaderVerified && (
            <span className="text-xs text-zinc-500 border border-zinc-700 rounded px-1">
              verified
            </span>
          )}
          {comment.isPinned && (
            <span className="text-xs text-zinc-500 border border-zinc-700 rounded px-1">
              pinned
            </span>
          )}
          {comment.publishedTime && (
            <span className="text-xs text-zinc-500">{comment.publishedTime}</span>
          )}
        </div>
        <p
          ref={textRef}
          className={`text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap${expanded ? "" : " line-clamp-5"}`}
        >
          <RichText text={comment.text} />
        </p>
        {(overflows || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-zinc-400 hover:text-zinc-200 text-left w-fit"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        {comment.likeCount >= 0 && (
          <span className="text-xs text-zinc-500">{likeDisplay} likes</span>
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
