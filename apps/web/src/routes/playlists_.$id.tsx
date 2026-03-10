import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { PlaylistRenameModal } from "../components/playlist-rename-modal";
import { PlaylistVideoRow } from "../components/playlist-video-row";
import { usePlaylist, usePlaylists } from "../hooks/use-playlists";
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
  const { remove, removeVideo, rename } = usePlaylists();
  const { data: playlist, isPending } = usePlaylist(id);
  const [renaming, setRenaming] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<PlaylistVideoItem | null>(null);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
        <p className="text-zinc-400 text-sm">Playlist not found.</p>
        <Link
          to="/playlists"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
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

  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/playlists"
            className="text-zinc-500 hover:text-zinc-100 transition-colors"
            aria-label="Back to playlists"
          >
            <BackIcon />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-semibold text-zinc-100">{playlist.name}</h1>
              <button
                type="button"
                onClick={() => setRenaming(true)}
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
                aria-label="Rename playlist"
              >
                <PencilIcon />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {count} video{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
        >
          Delete playlist
        </button>
      </div>
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
          <p className="text-zinc-400 text-sm">No videos in this playlist yet.</p>
          <p className="text-zinc-600 text-xs">
            Save videos from the watch page using the Save button.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.videos.map((video: PlaylistVideoItem, index: number) => (
            <div
              key={video.id}
              className="animate-card-pop-in"
              style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
            >
              <PlaylistVideoRow video={video} onRemove={() => setPendingRemove(video)} />
            </div>
          ))}
        </div>
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
