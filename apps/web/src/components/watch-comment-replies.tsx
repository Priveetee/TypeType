import { useCallback } from "react";
import { useCommentReplies } from "../hooks/use-comment-replies";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";
import { WatchReply } from "./watch-reply";

const SKELETON_KEYS = Array.from({ length: 3 }, (_, i) => `rs-${i}`);

type Props = {
  videoUrl: string;
  repliesPage: string;
};

export function WatchCommentReplies({ videoUrl, repliesPage }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useCommentReplies(
    videoUrl,
    repliesPage,
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const replies = data?.pages.flatMap((p) => p.comments) ?? [];

  return (
    <div className="border-l border-zinc-800 pl-11 flex flex-col gap-4 mt-3">
      {replies.map((reply) => (
        <WatchReply key={reply.id} reply={reply} />
      ))}
      {(isLoading || isFetchingNextPage) &&
        SKELETON_KEYS.map((k) => <WatchCommentSkeleton key={k} />)}
      {hasNextPage && !isFetchingNextPage && (
        <button
          type="button"
          onClick={loadMore}
          className="text-xs text-blue-400 hover:text-blue-300 text-left w-fit"
        >
          Load more replies
        </button>
      )}
    </div>
  );
}
