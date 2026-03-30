import { useCallback, useEffect, useRef, useState } from "react";

const WHEEL_THRESHOLD = 45;
const SWIPE_THRESHOLD = 50;

export function useShortsNavigation(
  itemCount: number,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
) {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    if (index >= itemCount) setIndex(0);
  }, [index, itemCount]);

  const moveBy = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (itemCount === 0) return 0;
        const next = Math.min(itemCount - 1, Math.max(0, current + delta));
        if (next >= itemCount - 2 && hasNextPage && !isFetchingNextPage) fetchNextPage();
        return next;
      });
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount],
  );

  const moveTo = useCallback(
    (target: number) => {
      setIndex(() => {
        if (itemCount === 0) return 0;
        const next = Math.min(itemCount - 1, Math.max(0, target));
        if (next >= itemCount - 2 && hasNextPage && !isFetchingNextPage) fetchNextPage();
        return next;
      });
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") moveBy(1);
      if (event.key === "ArrowUp") moveBy(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveBy]);

  const onWheel = useCallback(
    (deltaY: number) => {
      if (wheelLockRef.current) return;
      if (Math.abs(deltaY) < WHEEL_THRESHOLD) return;
      wheelLockRef.current = true;
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 250);
      moveBy(deltaY > 0 ? 1 : -1);
    },
    [moveBy],
  );

  const onTouchStart = useCallback((clientY: number | null) => {
    touchStartRef.current = clientY;
  }, []);

  const onTouchEnd = useCallback(
    (clientY: number | null) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (start === null || clientY === null) return;
      const delta = start - clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      moveBy(delta > 0 ? 1 : -1);
    },
    [moveBy],
  );

  return { index, moveBy, moveTo, onWheel, onTouchStart, onTouchEnd };
}
