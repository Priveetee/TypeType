import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type DragEvent, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { PlaylistRenameModal } from "../components/playlist-rename-modal";
import { PlaylistSortMenu } from "../components/playlist-sort-menu";
import { PlaylistVideoRow } from "../components/playlist-video-row";
import { usePlaylist, usePlaylists } from "../hooks/use-playlists";
import { type PlaylistSortMode, sortPlaylistVideos } from "../lib/playlist-sort";
import type { PlaylistVideoItem } from "../types/user";

function BackIcon() {
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
      aria-label="Back"
    >
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Rename"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function PlaylistDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { remove, removeVideo, rename, reorder } = usePlaylists();
  const { data: playlist, isPending } = usePlaylist(id);
  const [renaming, setRenaming] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<PlaylistVideoItem | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [sortMode, setSortMode] = useState<PlaylistSortMode>("manual");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-fg-soft text-sm">Loading...</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
        <p className="text-fg-muted text-sm">Playlist not found.</p>
        <Link
          to="/playlists"
          className="text-xs text-fg-soft hover:text-fg-muted transition-colors"
        >
          Back to playlists
        </Link>
      </div>
    );
  }

  function handleDelete() {
    remove.mutate(id);
    navigate({ to: "/playlists" });
  }

  const count = playlist.videos.length;
  const sortedVideos = sortPlaylistVideos(playlist.videos, sortMode);
  const reorderable = sortMode === "manual";

  function handleDragStart(event: DragEvent, index: number) {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    const card = (event.currentTarget as HTMLElement).closest("[data-pl-card]");
    if (card instanceof HTMLElement) event.dataTransfer.setDragImage(card, 20, 20);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      const next = [...sortedVideos];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      reorder.mutate({ id, order: next.map((video) => video.url) });
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/playlists"
            className="text-fg-soft hover:text-fg transition-colors"
            aria-label="Back to playlists"
          >
            <BackIcon />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-semibold text-fg">{playlist.name}</h1>
              <button
                type="button"
                onClick={() => setRenaming(true)}
                className="text-fg-soft hover:text-fg-muted transition-colors"
                aria-label="Rename playlist"
              >
                <PencilIcon />
              </button>
            </div>
            <p className="text-xs text-fg-soft">
              {count} video{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && <PlaylistSortMenu value={sortMode} onChange={setSortMode} />}
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-xs px-3 py-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
          >
            Delete playlist
          </button>
        </div>
      </div>
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
          <p className="text-fg-muted text-sm">No videos in this playlist yet.</p>
          <p className="text-fg-soft text-xs">
            Save videos from the watch page using the Save button.
          </p>
        </div>
      ) : (
        <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedVideos.map((video, index) => (
            <li
              key={video.id}
              data-pl-card="true"
              className={`animate-card-pop-in rounded-xl ${
                reorderable && overIndex === index && dragIndex !== null ? "ring-2 ring-accent" : ""
              } ${reorderable && dragIndex === index ? "opacity-40" : ""}`}
              style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
              onDragOver={
                reorderable
                  ? (event) => {
                      event.preventDefault();
                      setOverIndex(index);
                    }
                  : undefined
              }
              onDrop={reorderable ? () => handleDrop(index) : undefined}
              onDragEnd={
                reorderable
                  ? () => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }
                  : undefined
              }
            >
              <PlaylistVideoRow
                video={video}
                onRemove={() => setPendingRemove(video)}
                reorderable={reorderable}
                listId={id}
                onDragStart={(event) => handleDragStart(event, index)}
              />
            </li>
          ))}
        </ul>
      )}
      {pendingRemove && (
        <ConfirmModal
          title="Remove video"
          description={`Remove "${pendingRemove.title}" from this playlist?`}
          confirmLabel="Remove"
          onConfirm={() => {
            removeVideo.mutate({ playlistId: playlist.id, videoUrl: pendingRemove.url });
            setPendingRemove(null);
          }}
          onCancel={() => setPendingRemove(null)}
        />
      )}
      {confirmingDelete && (
        <ConfirmModal
          title="Delete playlist"
          description={`Delete "${playlist.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            setConfirmingDelete(false);
            handleDelete();
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
      {renaming && (
        <PlaylistRenameModal
          currentName={playlist.name}
          onConfirm={(name) => {
            rename.mutate({ id, name });
            setRenaming(false);
          }}
          onCancel={() => setRenaming(false)}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/playlists_/$id")({
  component: PlaylistDetailPage,
});
