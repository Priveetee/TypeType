import { useCallback, useEffect, useRef, useState } from "react";

const WHEEL_THRESHOLD = 14;
const WHEEL_RESET_MS = 180;
const WHEEL_LOCK_MS = 70;
const WHEEL_MAX_STEPS = 2;
const SWIPE_THRESHOLD = 30;
const SWIPE_MIN_DISTANCE = 10;
const SWIPE_VELOCITY_THRESHOLD = 0.24;
const TOUCH_LOCK_MS = 100;
const INTERACTIVE_TOUCH_SELECTOR =
  "button, a, input, textarea, select, [role='button'], [role='menu'], .vds-button, .vds-controls, .vds-slider";
type MoveReason = "user" | "auto";

function isInteractiveTouchTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(INTERACTIVE_TOUCH_SELECTOR) !== null;
}

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
  const touchStartedAtRef = useRef<number | null>(null);
  const touchFromInteractiveRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const wheelLastAtRef = useRef(0);
  const wheelLockedUntilRef = useRef(0);
  const touchLockedUntilRef = useRef(0);

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
        return false;
      }
      const current = indexRef.current;
      const next = Math.min(itemCount - 1, Math.max(0, current + delta));
      const actualDelta = next - current;
      if (actualDelta === 0) return false;
      indexRef.current = next;
      setIndex(next);
      if (next >= itemCount - 2 && hasNextPage && !isFetchingNextPage) fetchNextPage();
      onMove?.(actualDelta, reason);
      return true;
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
      const now = performance.now();
      if (now - wheelLastAtRef.current > WHEEL_RESET_MS) wheelAccumRef.current = 0;
      wheelLastAtRef.current = now;
      wheelAccumRef.current += deltaY;
      if (now < wheelLockedUntilRef.current) return;
      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;
      const steps = Math.min(
        WHEEL_MAX_STEPS,
        Math.max(1, Math.floor(Math.abs(wheelAccumRef.current) / WHEEL_THRESHOLD)),
      );
      const moved = moveBy(wheelAccumRef.current > 0 ? steps : -steps, "user");
      wheelAccumRef.current = 0;
      if (!moved) return;
      wheelLockedUntilRef.current = now + WHEEL_LOCK_MS;
    },
    [moveBy],
  );

  const onTouchStart = useCallback((clientY: number | null, touchTarget?: EventTarget | null) => {
    touchFromInteractiveRef.current = isInteractiveTouchTarget(touchTarget ?? null);
    if (touchFromInteractiveRef.current) {
      touchStartRef.current = null;
      touchStartedAtRef.current = null;
      return;
    }
    touchStartRef.current = clientY;
    touchStartedAtRef.current = clientY === null ? null : performance.now();
  }, []);

  const onTouchEnd = useCallback(
    (clientY: number | null, touchTarget?: EventTarget | null) => {
      const fromInteractive = touchFromInteractiveRef.current;
      touchFromInteractiveRef.current = false;
      if (fromInteractive || isInteractiveTouchTarget(touchTarget ?? null)) {
        touchStartRef.current = null;
        touchStartedAtRef.current = null;
        return;
      }
      const start = touchStartRef.current;
      const startedAt = touchStartedAtRef.current;
      touchStartRef.current = null;
      touchStartedAtRef.current = null;
      if (start === null || clientY === null || startedAt === null) return;
      const delta = start - clientY;
      const distance = Math.abs(delta);
      const duration = Math.max(1, performance.now() - startedAt);
      const velocity = distance / duration;
      const shouldMove =
        distance >= SWIPE_THRESHOLD ||
        (distance >= SWIPE_MIN_DISTANCE && velocity >= SWIPE_VELOCITY_THRESHOLD);
      if (!shouldMove) return;
      const now = performance.now();
      if (now < touchLockedUntilRef.current) return;
      const moved = moveBy(delta > 0 ? 1 : -1, "user");
      if (!moved) return;
      touchLockedUntilRef.current = now + TOUCH_LOCK_MS;
    },
    [moveBy],
  );

  return { index, moveBy, moveTo, onWheel, onTouchStart, onTouchEnd };
}
