import { useMediaState } from "@vidstack/react";
import type { SponsorBlockSegmentItem } from "../types/api";

const CATEGORY_COLORS: Record<string, string> = {
  sponsor: "#00d400",
  selfpromo: "#ffff00",
  interaction: "#cc00ff",
  poi_highlight: "#ff1684",
  intro: "#00ffff",
  outro: "#0202ed",
  preview: "#008fd6",
  filler: "#7300ff",
  music_offtopic: "#ff9900",
};

type SegmentBarProps = {
  segment: SponsorBlockSegmentItem;
  duration: number;
};

function SegmentBar({ segment, duration }: SegmentBarProps) {
  const color = CATEGORY_COLORS[segment.category];
  if (!color) return null;
  const left = (segment.startTime / 1000 / duration) * 100;
  const width = ((segment.endTime - segment.startTime) / 1000 / duration) * 100;
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        width: `${width}%`,
        top: 0,
        bottom: 0,
        backgroundColor: color,
        opacity: 0.8,
        pointerEvents: "none",
      }}
    />
  );
}

type Props = { segments: SponsorBlockSegmentItem[] };

export function SponsorBlockBar({ segments }: Props) {
  const duration = useMediaState("duration");

  if (!duration || segments.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "2.9rem",
        left: "1rem",
        right: "1rem",
        height: "3px",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {segments.map((seg) => (
        <SegmentBar key={`${seg.category}-${seg.startTime}`} segment={seg} duration={duration} />
      ))}
    </div>
  );
}
