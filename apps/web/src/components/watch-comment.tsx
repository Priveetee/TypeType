import type { Comment } from "../types/comment";

type Props = {
  comment: Comment;
};

function formatLikes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function WatchComment({ comment }: Props) {
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
        <p className="text-sm text-zinc-200 leading-relaxed">{comment.text}</p>
        {comment.likeCount >= 0 && (
          <span className="text-xs text-zinc-500">{formatLikes(comment.likeCount)} likes</span>
        )}
      </div>
    </div>
  );
}
