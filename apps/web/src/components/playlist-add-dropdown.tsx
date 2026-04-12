import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlaylists } from "../hooks/use-playlists";
import type { VideoStream } from "../types/stream";
import { PlaylistRow } from "./playlist-row";

const MARGIN = 8;

type Props = {
  stream: VideoStream;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSaved: (label: string) => void;
};

export function PlaylistAddDropdown({ stream, anchorEl, onClose, onSaved }: Props) {
  const { query, create, addVideo, removeVideo, isInPlaylist } = usePlaylists();
  const playlists = query.data ?? [];
  const [newName, setNewName] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const anchorElRef = useRef(anchorEl);
  anchorElRef.current = anchorEl;

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

    setPanelStyle({ position: "fixed", top, left, visibility: "visible" });
  }, [anchorEl]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      const outsidePanel = panelRef.current && !panelRef.current.contains(target);
      const outsideAnchor = !anchorElRef.current?.contains(target);
      if (outsidePanel && outsideAnchor) onCloseRef.current();
    }
    function onScroll() {
      onCloseRef.current();
    }
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function handleToggle(playlistId: string) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;
    if (isInPlaylist(playlistId, stream.id)) {
      removeVideo.mutate({ playlistId, videoUrl: stream.id });
      onSaved(`Removed from ${playlist.name}`);
    } else {
      addVideo.mutate({
        playlistId,
        video: {
          url: stream.id,
          title: stream.title,
          thumbnail: stream.thumbnail,
          duration: stream.duration,
        },
      });
      onSaved(`Saved to ${playlist.name}`);
    }
  }

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    create.mutate(trimmed);
    setNewName("");
    onSaved(`Playlist "${trimmed}" created`);
  }

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50 flex flex-col w-60 max-h-80 overflow-hidden rounded-xl bg-surface border border-border-strong shadow-2xl [animation:dropdown-fade-in_0.15s_ease-out]"
      style={panelStyle}
    >
      <p className="flex-shrink-0 text-xs text-fg-muted px-3 pt-3 pb-1 uppercase tracking-wider font-medium">
        Save to playlist
      </p>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {playlists.length === 0 && (
          <p className="text-xs text-fg-soft px-3 py-3">No playlists yet.</p>
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
      <div className="flex-shrink-0 border-t border-border p-2 flex gap-1.5">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New playlist..."
          className="min-w-0 flex-1 text-xs bg-surface-strong text-fg placeholder-zinc-500 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-border-strong"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="flex-shrink-0 text-xs px-2.5 py-1.5 bg-surface-soft hover:bg-surface-soft text-fg rounded-lg transition-colors"
        >
          Create
        </button>
      </div>
    </div>,
    document.body,
  );
}
