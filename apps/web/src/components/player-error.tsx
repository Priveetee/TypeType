import { useRouter } from "@tanstack/react-router";

export function PlayerError() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-5 z-50">
      <img src="/sad-sigh.gif" width="220" height="220" alt="" className="rounded-2xl" />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-white text-base font-semibold tracking-tight">Playback failed</p>
        <p className="text-zinc-400 text-sm max-w-xs text-center">
          This video could not be played. The stream may be unavailable or unsupported.
        </p>
      </div>
      <button
        type="button"
        onClick={() => router.history.back()}
        className="px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors cursor-pointer"
      >
        Go back
      </button>
    </div>
  );
}
