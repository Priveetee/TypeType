import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlaylistStore } from "../stores/playlist-store";
import type { VideoStream } from "../types/stream";

const MARGIN = 8;

type Props = {
  stream: VideoStream;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSaved: (label: string) => void;
};

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Selected"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type RowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

function PlaylistRow({ label, checked, onToggle }: RowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
    >
      <span
        className={`w-4 h-4 flex items-center justify-center rounded border flex-shrink-0 transition-colors ${
          checked ? "bg-zinc-100 border-zinc-100 text-zinc-900" : "border-zinc-500"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
      <span className="truncate text-left">{label}</span>
    </button>
  );
}

export function PlaylistAddDropdown({ stream, anchorEl, onClose, onSaved }: Props) {
  const { playlists, createPlaylist, addToPlaylist, removeFromPlaylist, isInPlaylist } =
    usePlaylistStore();
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!anchorEl || !panelRef.current) return;
    const anchor = anchorEl.getBoundingClientRect();
    const panel = panelRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    let left = anchor.right - panel.width;
    left = Math.min(left, vw - panel.width - MARGIN);
    left = Math.max(MARGIN, left);

    const spaceBelow = vh - anchor.bottom - MARGIN;
    const spaceAbove = anchor.top - MARGIN;
    let top: number;
    if (spaceBelow >= panel.height || spaceBelow >= spaceAbove) {
      top = anchor.bottom + MARGIN;
    } else {
      top = anchor.top - panel.height - MARGIN;
    }
    top = Math.max(MARGIN, Math.min(top, vh - panel.height - MARGIN));

    setPanelStyle({ top, left, visibility: "visible" });
  }, [anchorEl]);

  function handleToggle(playlistId: string) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;
    if (isInPlaylist(playlistId, stream.id)) {
      removeFromPlaylist(playlistId, stream.id);
      onSaved(`Removed from ${playlist.name}`);
    } else {
      addToPlaylist(playlistId, stream);
      onSaved(`Saved to ${playlist.name}`);
    }
  }

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createPlaylist(trimmed);
    setNewName("");
    inputRef.current?.focus();
  }

  return createPortal(
    <>
      <div role="none" className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed z-50 flex flex-col w-60 max-h-80 overflow-hidden rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl [animation:dropdown-fade-in_0.15s_ease-out]"
        style={panelStyle}
      >
        <p className="flex-shrink-0 text-xs text-zinc-400 px-3 pt-3 pb-1 uppercase tracking-wider font-medium">
          Save to playlist
        </p>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {playlists.length === 0 && (
            <p className="text-xs text-zinc-500 px-3 py-3">No playlists yet.</p>
          )}
          {playlists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              label={playlist.name}
              checked={isInPlaylist(playlist.id, stream.id)}
              onToggle={() => handleToggle(playlist.id)}
            />
          ))}
        </div>
        <div className="flex-shrink-0 border-t border-zinc-800 p-2 flex gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New playlist..."
            className="min-w-0 flex-1 text-xs bg-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="flex-shrink-0 text-xs px-2.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
