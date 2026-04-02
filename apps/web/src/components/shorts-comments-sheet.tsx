import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useInfiniteComments } from "../hooks/use-infinite-comments";
import { ScrollSentinel } from "./scroll-sentinel";
import { WatchComment } from "./watch-comment";
import { WatchCommentSkeleton } from "./watch-comment-skeleton";

const SKELETON_KEYS = Array.from({ length: 4 }, (_, i) => `scs-${i}`);
const INITIAL_RENDER_COUNT = 20;
const RENDER_STEP = 14;

type Props = {
  videoUrl: string;
  anchorEl?: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

export function ShortsCommentsSheet({ videoUrl, anchorEl, open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [renderCount, setRenderCount] = useState(INITIAL_RENDER_COUNT);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useInfiniteComments(
    videoUrl,
    open,
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setIsMounted(false), 260);
      return () => clearTimeout(timer);
    }
    setIsMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setRenderCount(INITIAL_RENDER_COUNT);
  }, [open]);

  const desktopStyle = useMemo(() => {
    if (!anchorEl || typeof window === "undefined") {
      return {
        top: "5rem",
        left: "1rem",
        height: "calc(100svh - 7rem)",
        width: "min(26rem, calc(100vw - 2rem))",
      };
    }
    const rect = anchorEl.getBoundingClientRect();
    const gap = 14;
    const leftBoundary = 12;
    const available = rect.left - leftBoundary - gap;
    const width = Math.min(Math.max(available, 320), 460);
    return {
      top: `${rect.top}px`,
      left: `${Math.max(rect.left - width - gap, leftBoundary)}px`,
      height: `${rect.height}px`,
      width: `${width}px`,
    };
  }, [anchorEl]);

  const commentsDisabled = data?.pages[0]?.commentsDisabled ?? false;
  const comments =
    data?.pages.flatMap((p) => p.comments).filter((comment) => comment.text && comment.author) ??
    [];
  const visibleComments = useMemo(() => comments.slice(0, renderCount), [comments, renderCount]);
  const hasHiddenComments = visibleComments.length < comments.length;
  const revealMore = useCallback(() => {
    if (!hasHiddenComments) return;
    setRenderCount((count) => Math.min(count + RENDER_STEP, comments.length));
  }, [hasHiddenComments, comments.length]);

  if (!isMounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/35 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
        role="none"
        onClick={onClose}
      />
      <section
        className="fixed inset-x-3 bottom-3 z-[80] max-h-[82svh] rounded-2xl border border-zinc-700/80 bg-zinc-950/92 p-4 shadow-2xl backdrop-blur transition-all duration-300 ease-out md:inset-x-auto md:max-h-none"
        style={{
          top: window.innerWidth >= 768 ? desktopStyle.top : undefined,
          left: window.innerWidth >= 768 ? desktopStyle.left : undefined,
          height: window.innerWidth >= 768 ? desktopStyle.height : undefined,
          width: window.innerWidth >= 768 ? desktopStyle.width : undefined,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Close
          </button>
        </div>
        <div className="h-px bg-zinc-800" />
        <div
          ref={scrollRef}
          className="mt-3 h-[calc(100%-3rem)] space-y-5 overflow-y-auto pr-1 scroll-smooth"
        >
          {commentsDisabled ? (
            <p className="text-sm text-zinc-500">Comments are disabled for this video.</p>
          ) : (
            <>
              {visibleComments.map((comment, i) => (
                <div key={comment.id || `short-comment-${i}`}>
                  <WatchComment comment={comment} videoUrl={videoUrl} />
                </div>
              ))}
              <ScrollSentinel
                onIntersect={revealMore}
                enabled={hasHiddenComments}
                root={scrollRef.current}
              />
              {(isLoading || isFetchingNextPage) &&
                SKELETON_KEYS.map((key) => <WatchCommentSkeleton key={key} />)}
              <ScrollSentinel
                onIntersect={loadMore}
                enabled={!hasHiddenComments && !!hasNextPage && !isFetchingNextPage}
                root={scrollRef.current}
              />
            </>
          )}
        </div>
      </section>
    </>,
    document.body,
  );
}
