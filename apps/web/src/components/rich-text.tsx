import { useState } from "react";
import { ExternalLinkModal } from "./external-link-modal";

type Segment =
  | { id: string; type: "text"; value: string }
  | { id: string; type: "url"; value: string }
  | { id: string; type: "timecode"; value: string; seconds: number };

function parseTimestampToSeconds(value: string): number | null {
  const parts = value.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return null;
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
}

function parseSegments(text: string): Segment[] {
  const regex = /https?:\/\/[^\s\])"',;:!>]+|\b(?:\d{1,2}:)?[0-5]?\d:[0-5]\d\b/g;
  const segments: Segment[] = [];
  let lastIndex = 0;
  let counter = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      segments.push({
        id: `t${counter++}`,
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    const value = match[0];
    if (value.startsWith("http://") || value.startsWith("https://")) {
      segments.push({ id: `u${counter++}`, type: "url", value });
    } else {
      const seconds = parseTimestampToSeconds(value);
      if (seconds === null) {
        segments.push({ id: `t${counter++}`, type: "text", value });
      } else {
        segments.push({ id: `c${counter++}`, type: "timecode", value, seconds });
      }
    }
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    segments.push({ id: `t${counter}`, type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

type RichTextProps = {
  text: string;
  onSeekTimestamp?: (seconds: number) => void;
};

export function RichText({ text, onSeekTimestamp }: RichTextProps) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const segments = parseSegments(text);

  return (
    <span>
      {segments.map((seg) =>
        seg.type === "text" ? (
          <span key={seg.id}>{seg.value}</span>
        ) : seg.type === "url" ? (
          <a
            key={seg.id}
            href={seg.value}
            onClick={(event) => {
              event.preventDefault();
              setPendingUrl(seg.value);
            }}
            className="text-accent hover:text-accent-strong underline underline-offset-2 transition-colors break-all text-left align-baseline"
          >
            {seg.value}
          </a>
        ) : onSeekTimestamp ? (
          <button
            key={seg.id}
            type="button"
            onClick={() => onSeekTimestamp(seg.seconds)}
            className="text-accent hover:text-accent-strong underline underline-offset-2 transition-colors"
          >
            {seg.value}
          </button>
        ) : (
          <span key={seg.id}>{seg.value}</span>
        ),
      )}
      {pendingUrl && (
        <ExternalLinkModal
          url={pendingUrl}
          onConfirm={() => {
            window.open(pendingUrl, "_blank", "noopener,noreferrer");
            setPendingUrl(null);
          }}
          onCancel={() => setPendingUrl(null)}
        />
      )}
    </span>
  );
}
