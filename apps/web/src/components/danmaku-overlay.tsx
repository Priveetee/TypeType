import { useEffect, useMemo, useRef, useState } from "react";
import { displayDuration, N_LANES, REGULAR_DISPLAY_MS } from "../lib/danmaku";
import { useDanmakuStore } from "../stores/danmaku-store";
import type { BulletCommentItem } from "../types/api";
import { DanmakuItem } from "./danmaku-item";

type Props = {
  comments: BulletCommentItem[];
  positionRef: React.RefObject<number>;
};

type IndexedComment = BulletCommentItem & { lane: number; id: number };

export function DanmakuOverlay({ comments, positionRef }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<IndexedComment[]>([]);
  const startMsMap = useRef(new Map<number, number>());
  const { speed, size } = useDanmakuStore();

  const indexed = useMemo<IndexedComment[]>(
    () =>
      comments
        .filter((c) => c.position !== "BOTTOM")
        .map((c, i) => ({ ...c, lane: i % N_LANES, id: i })),
    [comments],
  );

  useEffect(() => {
    let rafId: number;
    let prevKey = "";

    function tick() {
      const ms = positionRef.current;
      const currentSpeed = useDanmakuStore.getState().speed;
      const vis = indexed.filter((c) => {
        const elapsed = ms - c.durationMs;
        const dur =
          c.position === "REGULAR"
            ? REGULAR_DISPLAY_MS / currentSpeed
            : displayDuration(c.position);
        return elapsed >= 0 && elapsed < dur;
      });
      const key = vis.map((c) => c.id).join(",");
      if (key !== prevKey) {
        prevKey = key;
        for (const c of vis) {
          if (!startMsMap.current.has(c.id)) {
            startMsMap.current.set(c.id, ms);
          }
        }
        for (const id of startMsMap.current.keys()) {
          if (!vis.some((c) => c.id === id)) {
            startMsMap.current.delete(id);
          }
        }
        setVisible(vis);
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [indexed, positionRef]);

  const width = overlayRef.current?.offsetWidth ?? 0;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {visible.map((c) => (
        <DanmakuItem
          key={c.id}
          comment={c}
          lane={c.lane}
          containerWidth={width}
          elapsedMs={(startMsMap.current.get(c.id) ?? positionRef.current) - c.durationMs}
          speedMultiplier={speed}
          sizeMultiplier={size}
        />
      ))}
    </div>
  );
}
