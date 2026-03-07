import { useUiStore } from "../stores/ui-store";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD = "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden";
const ROW = "flex items-center justify-between px-4 py-4";

export function SettingsPlayback() {
  const autoplayEnabled = useUiStore((s) => s.autoplayEnabled);
  const toggleAutoplay = useUiStore((s) => s.toggleAutoplay);

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Playback</p>
      <div className={CARD}>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Autoplay</span>
            <span className="text-xs text-zinc-500">Automatically play the next video</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoplayEnabled}
            onClick={toggleAutoplay}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ml-6 ${
              autoplayEnabled ? "bg-zinc-100" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                autoplayEnabled ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-zinc-300"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
