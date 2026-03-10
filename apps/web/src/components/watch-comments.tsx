import { useCallback } from "react";
import { useInfiniteComments } from "../hooks/use-infinite-comments";
import { ScrollSentinel } from "./scroll-sentinel";
import { WatchComment } from "./watch-comment";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";

const SKELETON_KEYS = Array.from({ length: 5 }, (_, i) => `cs-${i}`);

type Props = {
  videoUrl: string;
};

export function WatchComments({ videoUrl }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteComments(videoUrl);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentsDisabled = data?.pages[0]?.commentsDisabled ?? false;
  const allComments = data?.pages.flatMap((p) => p.comments) ?? [];
  const comments = allComments.filter(
    (c) => (c.text as string | null) && (c.author as string | null),
  );
  const showSkeletons = isLoading || isFetchingNextPage;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-zinc-100">Comments</h2>
      {commentsDisabled ? (
        <p className="text-sm text-zinc-500">Comments are disabled for this video.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment, i) => (
            <div
              key={comment.id || `c-${i}`}
              className="animate-card-pop-in"
              style={{ animationDelay: `${Math.min(i * 35, 210)}ms` }}
            >
              <WatchComment comment={comment} videoUrl={videoUrl} />
            </div>
          ))}
          {showSkeletons && SKELETON_KEYS.map((k) => <WatchCommentSkeleton key={k} />)}
        </div>
      )}
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}
