import { lazy, Suspense } from "react";
import type { Comment } from "../types/comment";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";

const WatchCommentsList = lazy(() =>
  import("./watch-comments-list").then((module) => ({ default: module.WatchCommentsList })),
);

const FALLBACK_KEYS = Array.from({ length: 3 }, (_, i) => `wcl-${i}`);

type Props = {
  comments: Comment[];
  videoUrl: string;
};

export function WatchCommentsLazyList({ comments, videoUrl }: Props) {
  return (
    <Suspense fallback={FALLBACK_KEYS.map((k) => <WatchCommentSkeleton key={k} />)}>
      <WatchCommentsList comments={comments} videoUrl={videoUrl} />
    </Suspense>
  );
}
