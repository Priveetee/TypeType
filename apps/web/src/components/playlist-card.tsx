import { Link } from "@tanstack/react-router";
import { usePlaylistStore } from "../stores/playlist-store";
import type { Playlist } from "../types/playlist";

type Props = {
  playlist: Playlist;
};

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Delete"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Empty playlist"
      className="text-zinc-700"
    >
      <path d="M3 5h15" />
      <path d="M3 9h15" />
      <path d="M3 13h9" />
      <path d="M15 13l4 3-4 3V13z" />
    </svg>
  );
}

export function PlaylistCard({ playlist }: Props) {
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist);
  const thumbnail = playlist.streams[0]?.thumbnail;
  const count = playlist.streams.length;
  const label = `${count} video${count !== 1 ? "s" : ""}`;

  return (
    <div className="flex flex-col gap-2 group">
      <Link to="/playlists/$id" params={{ id: playlist.id }}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <EmptyIcon />
            </div>
          )}
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {label}
          </span>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-2">
        <Link to="/playlists/$id" params={{ id: playlist.id }} className="min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
            {playlist.name}
          </p>
          <p className="text-xs text-zinc-500">{label}</p>
        </Link>
        <button
          type="button"
          onClick={() => deletePlaylist(playlist.id)}
          aria-label="Delete playlist"
          className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
