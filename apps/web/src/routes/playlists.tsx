import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { PlaylistCard } from "../components/playlist-card";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { Toast } from "../components/toast";
import { usePlaylistStore } from "../stores/playlist-store";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
      <p className="text-zinc-400 text-sm">No playlists yet.</p>
      <p className="text-zinc-600 text-xs">Use the New playlist button to get started.</p>
    </div>
  );
}

function PlaylistsPage() {
  const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmIds, setConfirmIds] = useState<string[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function handleConfirm() {
    if (!confirmIds) return;
    const count = confirmIds.length;
    for (const id of confirmIds) deletePlaylist(id);
    setConfirmIds(null);
    exitSelection();
    setToastMsg(count === 1 ? "Playlist deleted" : `${count} playlists deleted`);
  }

  const confirmTitle =
    confirmIds === null
      ? ""
      : confirmIds.length === 1
        ? `Delete "${playlists.find((p) => p.id === confirmIds[0])?.name ?? "this playlist"}"?`
        : `Delete ${confirmIds.length} playlists?`;

  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Playlists</h1>
        <div className="flex items-center gap-2">
          {selectionMode ? (
            <>
              <span className="text-xs text-zinc-500">{selectedIds.size} selected</span>
              <button
                type="button"
                onClick={exitSelection}
                className="px-3 py-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedIds.size === 0}
                onClick={() => setConfirmIds([...selectedIds])}
                className="px-3 py-2 text-sm text-white bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Delete ({selectedIds.size})
              </button>
            </>
          ) : (
            <>
              {playlists.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectionMode(true)}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Select
                </button>
              )}
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="px-3 py-2 text-sm text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                New playlist
              </button>
            </>
          )}
        </div>
      </div>
      {playlists.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              selectionMode={selectionMode}
              selected={selectedIds.has(playlist.id)}
              onToggleSelect={() => toggleSelect(playlist.id)}
              onDeleteRequest={() => setConfirmIds([playlist.id])}
            />
          ))}
        </div>
      )}
      {creating && (
        <PlaylistCreateModal
          onConfirm={(name) => {
            createPlaylist(name);
            setCreating(false);
            setToastMsg(`"${name}" created`);
          }}
          onCancel={() => setCreating(false)}
        />
      )}
      {confirmIds !== null && (
        <ConfirmModal
          title={confirmTitle}
          description="This action cannot be undone."
          onConfirm={handleConfirm}
          onCancel={() => setConfirmIds(null)}
        />
      )}
      <Toast message={toastMsg} />
    </div>
  );
}

export const Route = createFileRoute("/playlists")({
  component: PlaylistsPage,
});
