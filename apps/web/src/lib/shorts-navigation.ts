import { useCallback, useEffect, useRef, useState } from "react";

const WHEEL_THRESHOLD = 45;
const SWIPE_THRESHOLD = 50;
type MoveReason = "user" | "auto";

export function useShortsNavigation(
  itemCount: number,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
  onMove?: (delta: number, reason: MoveReason) => void,
) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (indexRef.current >= itemCount) {
      indexRef.current = 0;
      setIndex(0);
    }
  }, [itemCount]);

  const moveBy = useCallback(
    (delta: number, reason: MoveReason = "user") => {
      if (itemCount === 0) {
        if (indexRef.current !== 0) {
          indexRef.current = 0;
          setIndex(0);
        }
        return;
      }
      const current = indexRef.current;
      const next = Math.min(itemCount - 1, Math.max(0, current + delta));
      const actualDelta = next - current;
      if (actualDelta === 0) return;
      indexRef.current = next;
      setIndex(next);
      if (next >= itemCount - 2 && hasNextPage && !isFetchingNextPage) fetchNextPage();
      onMove?.(actualDelta, reason);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount, onMove],
  );

  const moveTo = useCallback(
    (target: number, reason: MoveReason = "auto") => {
      if (itemCount === 0) {
        if (indexRef.current !== 0) {
          indexRef.current = 0;
          setIndex(0);
        }
        return;
      }
      const current = indexRef.current;
      const next = Math.min(itemCount - 1, Math.max(0, target));
      const actualDelta = next - current;
      if (actualDelta === 0) return;
      indexRef.current = next;
      setIndex(next);
      if (next >= itemCount - 2 && hasNextPage && !isFetchingNextPage) fetchNextPage();
      onMove?.(actualDelta, reason);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount, onMove],
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
      moveBy(deltaY > 0 ? 1 : -1, "user");
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
      moveBy(delta > 0 ? 1 : -1, "user");
    },
    [moveBy],
  );

  return { index, moveBy, moveTo, onWheel, onTouchStart, onTouchEnd };
}
