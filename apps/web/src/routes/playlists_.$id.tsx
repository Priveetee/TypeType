import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlaylistStore } from "../stores/playlist-store";
import type { VideoStream } from "../types/stream";

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

function XIcon() {
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
      aria-label="Remove"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type VideoItemProps = {
  stream: VideoStream;
  onRemove: () => void;
};

function PlaylistVideoItem({ stream, onRemove }: VideoItemProps) {
  return (
    <div className="flex flex-col gap-2 group relative">
      <Link to="/watch" search={{ v: stream.id }} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            aria-label="Remove from playlist"
            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XIcon />
          </button>
        </div>
      </Link>
      <Link to="/watch" search={{ v: stream.id }}>
        <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug group-hover:text-white transition-colors">
          {stream.title}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{stream.channelName}</p>
      </Link>
    </div>
  );
}

function PlaylistDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { playlists, deletePlaylist, removeFromPlaylist } = usePlaylistStore();
  const playlist = playlists.find((p) => p.id === id);

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
    deletePlaylist(id);
    navigate({ to: "/playlists" });
  }

  const count = playlist.streams.length;

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
            <h1 className="text-lg font-semibold text-zinc-100">{playlist.name}</h1>
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
          {playlist.streams.map((stream: VideoStream) => (
            <PlaylistVideoItem
              key={stream.id}
              stream={stream}
              onRemove={() => removeFromPlaylist(playlist.id, stream.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/playlists_/$id")({
  component: PlaylistDetailPage,
});
