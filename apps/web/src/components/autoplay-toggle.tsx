import { useUiStore } from "../stores/ui-store";

export function AutoplayToggle() {
  const autoplayEnabled = useUiStore((s) => s.autoplayEnabled);
  const toggleAutoplay = useUiStore((s) => s.toggleAutoplay);

  return (
    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
      <span className="text-sm text-zinc-300">Autoplay</span>
      <button
        type="button"
        role="switch"
        aria-checked={autoplayEnabled}
        onClick={toggleAutoplay}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
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
  );
}
