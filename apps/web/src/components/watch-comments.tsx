import { useCallback, useMemo, useState } from "react";
import { useInfiniteComments } from "../hooks/use-infinite-comments";
import { ScrollSentinel } from "./scroll-sentinel";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";
import { WatchCommentsLazyList } from "./watch-comments-lazy-list";

const SKELETON_KEYS = Array.from({ length: 5 }, (_, i) => `cs-${i}`);
const INITIAL_RENDER_COUNT = 24;
const RENDER_STEP = 20;

type Props = {
  videoUrl: string;
};

export function WatchComments({ videoUrl }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteComments(videoUrl);
  const [renderCount, setRenderCount] = useState(INITIAL_RENDER_COUNT);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentsDisabled = data?.pages[0]?.commentsDisabled ?? false;
  const allComments = data?.pages.flatMap((p) => p.comments) ?? [];
  const comments = allComments.filter(
    (c) => (c.text as string | null) && (c.author as string | null),
  );
  const visibleComments = useMemo(() => comments.slice(0, renderCount), [comments, renderCount]);
  const hasHiddenComments = visibleComments.length < comments.length;
  const revealMore = useCallback(() => {
    if (!hasHiddenComments) return;
    setRenderCount((count) => Math.min(count + RENDER_STEP, comments.length));
  }, [hasHiddenComments, comments.length]);
  const showSkeletons = isLoading || isFetchingNextPage;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-zinc-100">Comments</h2>
      {commentsDisabled ? (
        <p className="text-sm text-zinc-500">Comments are disabled for this video.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <WatchCommentsLazyList comments={visibleComments} videoUrl={videoUrl} />
          <ScrollSentinel onIntersect={revealMore} enabled={hasHiddenComments} />
          {showSkeletons && SKELETON_KEYS.map((k) => <WatchCommentSkeleton key={k} />)}
        </div>
      )}
      <ScrollSentinel
        onIntersect={loadMore}
        enabled={!hasHiddenComments && !!hasNextPage && !isFetchingNextPage}
      />
    </div>
  );
}
