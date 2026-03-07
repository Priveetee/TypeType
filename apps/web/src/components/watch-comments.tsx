import { useCallback } from "react";
import { useInfiniteComments } from "../hooks/use-infinite-comments";
import { ScrollSentinel } from "./scroll-sentinel";
import { WatchComment } from "./watch-comment";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";

const SKELETON_KEYS = Array.from({ length: 5 }, (_, i) => `cs-${i}`);

type Props = {
  videoId: string;
};

export function WatchComments({ videoId }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteComments(videoId);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];
  const showSkeletons = isLoading || isFetchingNextPage;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-zinc-100">Comments</h2>
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <WatchComment key={comment.id} comment={comment} />
        ))}
        {showSkeletons && SKELETON_KEYS.map((k) => <WatchCommentSkeleton key={k} />)}
      </div>
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}
