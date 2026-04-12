import { useState } from "react";
import { ExternalLinkModal } from "./external-link-modal";

type Segment = { id: string } & ({ type: "text"; value: string } | { type: "url"; value: string });

function parseSegments(text: string): Segment[] {
  const regex = /https?:\/\/[^\s\])"',;:!>]+/g;
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
    segments.push({ id: `u${counter++}`, type: "url", value: match[0] });
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    segments.push({ id: `t${counter}`, type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

type Props = { text: string };

export function RichText({ text }: Props) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const segments = parseSegments(text);

  return (
    <span>
      {segments.map((seg) =>
        seg.type === "text" ? (
          <span key={seg.id}>{seg.value}</span>
        ) : (
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
