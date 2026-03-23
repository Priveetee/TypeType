export function YoutubeImportGuide() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm">
      <p className="font-medium text-zinc-200">Before you continue</p>
      <p className="mt-1 text-zinc-500 text-xs">
        Keep only YouTube and My Activity selected in Takeout. ZIP format works best.
      </p>
      <p className="mt-1 text-zinc-500 text-xs">
        This import currently moves subscriptions, playlists, and playlist videos.
      </p>
    </div>
  );
}
