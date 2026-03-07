import { useRef, useState } from "react";
import type { VideoStream } from "../types/stream";
import { PlaylistAddDropdown } from "./playlist-add-dropdown";
import { Toast } from "./toast";

type Props = {
  stream: VideoStream;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function SvgIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <SvgIcon label="Likes">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </SvgIcon>
  );
}

function ThumbDownIcon() {
  return (
    <SvgIcon label="Dislikes">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </SvgIcon>
  );
}

function ShareIcon() {
  return (
    <SvgIcon label="Share">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </SvgIcon>
  );
}

function ListPlusIcon() {
  return (
    <SvgIcon label="Save to playlist">
      <path d="M11 12H3" />
      <path d="M16 6H3" />
      <path d="M16 18H3" />
      <path d="M18 9v6" />
      <path d="M21 12h-6" />
    </SvgIcon>
  );
}

const STAT = "flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 select-none";
const BTN = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors";
const BTN_IDLE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";
const BTN_ON = "text-zinc-100 bg-zinc-800";

export function WatchActions({ stream }: Props) {
  const [copied, setCopied] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const saveAnchorRef = useRef<HTMLButtonElement>(null);

  function handleShare() {
    const url = `https://www.youtube.com/watch?v=${stream.id}`;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard?.writeText(url).catch(() => undefined);
  }

  function handleSaved(label: string) {
    setSavedLabel(label);
    setTimeout(() => setSavedLabel(null), 2000);
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className={STAT}>
        <ThumbUpIcon />
        {formatCount(stream.likes ?? 0)}
      </span>
      <div className="w-px h-5 bg-zinc-800" />
      <span className={STAT}>
        <ThumbDownIcon />
        {stream.dislikes !== undefined ? formatCount(stream.dislikes) : "–"}
      </span>
      <div className="w-2" />
      <button type="button" onClick={handleShare} className={`${BTN} ${BTN_IDLE}`}>
        <ShareIcon />
        Share
      </button>
      <Toast message={copied ? "Link copied to clipboard" : savedLabel} />
      <button
        ref={saveAnchorRef}
        type="button"
        onClick={() => setPlaylistOpen((o) => !o)}
        className={`${BTN} ${playlistOpen ? BTN_ON : BTN_IDLE}`}
      >
        <ListPlusIcon />
        Save
      </button>
      {playlistOpen && (
        <PlaylistAddDropdown
          stream={stream}
          anchorEl={saveAnchorRef.current}
          onClose={() => setPlaylistOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
