import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlaylistCard } from "../components/playlist-card";
import { usePlaylistStore } from "../stores/playlist-store";

function PlaylistCreateForm() {
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    createPlaylist(trimmed);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist name..."
        className="bg-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-600 w-48"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-medium rounded-lg hover:bg-white transition-colors flex-shrink-0"
      >
        New playlist
      </button>
    </form>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-2 text-center">
      <p className="text-zinc-400 text-sm">No playlists yet.</p>
      <p className="text-zinc-600 text-xs">Create your first playlist using the form above.</p>
    </div>
  );
}

function PlaylistsPage() {
  const playlists = usePlaylistStore((s) => s.playlists);

  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Playlists</h1>
        <PlaylistCreateForm />
      </div>
      {playlists.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/playlists")({
  component: PlaylistsPage,
});
