import { useSettings } from "../hooks/use-settings";
import { LanguageDropdown } from "./language-dropdown";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD = "bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

type ToggleProps = {
  checked: boolean;
  onClick: () => void;
};

function Toggle({ checked, onClick }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onClick}
      className={`relative ml-6 h-5 w-10 flex-shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-zinc-100" : "bg-zinc-700"}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-all duration-200 ${checked ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-zinc-300"}`}
      />
    </button>
  );
}

export function SettingsLanguage() {
  const { settings, update } = useSettings();

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Language</p>
      <div className={CARD}>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Subtitles</span>
            <span className="text-xs text-zinc-500">Enable subtitles by default</span>
          </div>
          <Toggle
            checked={settings.subtitlesEnabled}
            onClick={() => update.mutate({ subtitlesEnabled: !settings.subtitlesEnabled })}
          />
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span
              className={`text-sm ${settings.subtitlesEnabled ? "text-zinc-100" : "text-zinc-500"}`}
            >
              Subtitle language
            </span>
            <span className="text-xs text-zinc-500">Preferred subtitle track</span>
          </div>
          <LanguageDropdown
            value={settings.defaultSubtitleLanguage}
            onChange={(v) => update.mutate({ defaultSubtitleLanguage: v })}
            disabled={!settings.subtitlesEnabled}
          />
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Audio language</span>
            <span className="text-xs text-zinc-500">
              {settings.preferOriginalLanguage
                ? "Ignored while original language is forced"
                : "Preferred audio track"}
            </span>
          </div>
          <LanguageDropdown
            value={settings.defaultAudioLanguage}
            onChange={(v) => update.mutate({ defaultAudioLanguage: v })}
            disabled={settings.preferOriginalLanguage}
          />
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Prefer original language</span>
            <span className="text-xs text-zinc-500">Always use the original audio track</span>
          </div>
          <Toggle
            checked={settings.preferOriginalLanguage}
            onClick={() =>
              update.mutate({ preferOriginalLanguage: !settings.preferOriginalLanguage })
            }
          />
        </div>
      </div>
    </section>
  );
}
