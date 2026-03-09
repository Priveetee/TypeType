import { useMediaState } from "@vidstack/react";
import { useEffect, useRef } from "react";
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

const TRACK_HEIGHT = 5;
const THUMB_MARGIN = 7.5;

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
  const controlsVisible = useMediaState("controlsVisible");
  const anchorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    if (!anchor || !overlay || !duration) return;

    const player = anchor.closest<HTMLElement>("[data-media-player]");
    const slider = player?.querySelector<HTMLElement>(".vds-time-slider");
    if (!player || !slider) return;

    const update = () => {
      const pRect = player.getBoundingClientRect();
      const sRect = slider.getBoundingClientRect();
      const trackCenterY = sRect.top - pRect.top + sRect.height / 2;
      overlay.style.top = `${trackCenterY - TRACK_HEIGHT / 2}px`;
      overlay.style.left = `${sRect.left - pRect.left + THUMB_MARGIN}px`;
      overlay.style.width = `${sRect.width - THUMB_MARGIN * 2}px`;
    };

    const ro = new ResizeObserver(update);
    ro.observe(player);
    update();
    return () => ro.disconnect();
  }, [duration]);

  if (!duration || segments.length === 0) return null;

  return (
    <>
      <div ref={anchorRef} style={{ display: "none" }} />
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          height: `${TRACK_HEIGHT}px`,
          pointerEvents: "none",
          zIndex: 40,
          visibility: controlsVisible ? "visible" : "hidden",
        }}
      >
        {segments.map((seg) => (
          <SegmentBar key={`${seg.category}-${seg.startTime}`} segment={seg} duration={duration} />
        ))}
      </div>
    </>
  );
}
