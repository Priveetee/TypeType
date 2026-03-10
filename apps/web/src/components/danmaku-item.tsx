import { argbToColor, CHAR_WIDTH_PX, LANE_HEIGHT_PX, REGULAR_DISPLAY_MS } from "../lib/danmaku";
import type { BulletCommentItem } from "../types/api";

type Props = {
  comment: BulletCommentItem;
  lane: number;
  containerWidth: number;
  elapsedMs: number;
  speedMultiplier: number;
  sizeMultiplier: number;
};

const BASE: React.CSSProperties = {
  position: "absolute",
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  pointerEvents: "none",
  userSelect: "none",
};

export function DanmakuItem({
  comment,
  lane,
  containerWidth,
  elapsedMs,
  speedMultiplier,
  sizeMultiplier,
}: Props) {
  const color = argbToColor(comment.argbColor);
  const fontSize = Math.round(20 * comment.relativeFontSize * sizeMultiplier);

  if (comment.position === "REGULAR") {
    const estimatedWidth = comment.text.length * CHAR_WIDTH_PX;
    return (
      <span
        style={
          {
            ...BASE,
            color,
            fontSize: `${fontSize}px`,
            top: `${lane * LANE_HEIGHT_PX}px`,
            left: 0,
            animationName: "danmaku-scroll",
            animationDuration: `${REGULAR_DISPLAY_MS / speedMultiplier}ms`,
            animationDelay: `${-elapsedMs}ms`,
            animationTimingFunction: "linear",
            animationFillMode: "both",
            "--d-from": `${containerWidth}px`,
            "--d-to": `${-estimatedWidth}px`,
          } as React.CSSProperties
        }
      >
        {comment.text}
      </span>
    );
  }

  if (comment.position === "TOP" || comment.position === "SUPERCHAT") {
    return (
      <span
        style={{
          ...BASE,
          color,
          fontSize: `${fontSize}px`,
          top: `${4 + (lane % 3) * LANE_HEIGHT_PX}px`,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {comment.text}
      </span>
    );
  }

  return null;
}
