import { useSettings } from "../hooks/use-settings";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

const QUALITY_OPTIONS = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];

export function SettingsPlayback() {
  const { settings, update } = useSettings();

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
            aria-checked={settings.autoplay}
            onClick={() => update.mutate({ autoplay: !settings.autoplay })}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ml-6 ${
              settings.autoplay ? "bg-zinc-100" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                settings.autoplay ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-zinc-300"
              }`}
            />
          </button>
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Default quality</span>
            <span className="text-xs text-zinc-500">Preferred video resolution</span>
          </div>
          <select
            value={settings.defaultQuality}
            onChange={(e) => update.mutate({ defaultQuality: e.target.value })}
            className="ml-6 flex-shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            {QUALITY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
