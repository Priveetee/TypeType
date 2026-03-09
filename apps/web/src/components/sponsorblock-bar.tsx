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

type Props = { segments: SponsorBlockSegmentItem[] };

export function SponsorBlockBar({ segments }: Props) {
  const duration = useMediaState("duration");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!duration || segments.length === 0) return;

    const player = ref.current?.closest("[data-media-player]");
    const track = player?.querySelector(
      ".vds-time-slider .vds-slider-track:not(.vds-slider-track-fill):not(.vds-slider-progress)",
    );
    if (!(track instanceof HTMLElement)) return;

    const sorted = [...segments].sort((a, b) => a.startTime - b.startTime);
    const stops: string[] = ["to right"];
    for (const seg of sorted) {
      const color = CATEGORY_COLORS[seg.category];
      if (!color) continue;
      const start = (seg.startTime / 1000 / duration) * 100;
      const end = (seg.endTime / 1000 / duration) * 100;
      stops.push(`transparent ${start}%`);
      stops.push(`${color} ${start}%`);
      stops.push(`${color} ${end}%`);
      stops.push(`transparent ${end}%`);
    }

    if (stops.length <= 1) return;
    track.style.background = `linear-gradient(${stops.join(",")})`;

    return () => {
      track.style.background = "";
    };
  }, [segments, duration]);

  return <div ref={ref} style={{ display: "none" }} />;
}
