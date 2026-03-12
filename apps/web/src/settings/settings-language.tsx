import { useEffect, useRef, useState } from "react";
import { FlagIcon } from "../components/flag-icon";
import { useSettings } from "../hooks/use-settings";
import { LANGUAGES } from "../lib/languages";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD = "bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

const CHEVRON = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" role="img" aria-label="toggle">
    <path
      d="M2 4l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type DropdownProps = {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
};

function LanguageDropdown({ value, onChange, disabled = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = LANGUAGES.find((l) => l.code === value);
  const label = selected ? selected.label.split(" — ")[0] : "No preference";

  const filtered =
    query.trim() === ""
      ? LANGUAGES
      : LANGUAGES.filter(
          (l) =>
            l.label.toLowerCase().includes(query.toLowerCase()) ||
            l.code.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 0);
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative ml-6 flex-shrink-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-xs rounded-lg px-3 py-1.5 transition-colors ${disabled ? "text-zinc-600 cursor-not-allowed" : "text-zinc-100 hover:bg-zinc-700"}`}
      >
        {selected?.flag && (
          <FlagIcon code={selected.flag} className="w-4 h-3 rounded-sm flex-shrink-0" />
        )}
        {label}
        {CHEVRON}
      </button>
      {open && !disabled && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden z-10 w-56 shadow-lg flex flex-col">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search language..."
            className="px-3 py-2 text-xs bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 border-b border-zinc-700 focus:outline-none"
          />
          <div className="overflow-y-auto max-h-52">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs transition-colors ${value === "" ? "text-zinc-100 bg-zinc-700" : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"}`}
            >
              No preference
            </button>
            {filtered.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  onChange(l.code);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs transition-colors ${l.code === value ? "text-zinc-100 bg-zinc-700" : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"}`}
              >
                {l.flag && <FlagIcon code={l.flag} className="w-4 h-3 rounded-sm flex-shrink-0" />}
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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
          <button
            type="button"
            role="switch"
            aria-checked={settings.subtitlesEnabled}
            onClick={() => update.mutate({ subtitlesEnabled: !settings.subtitlesEnabled })}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ml-6 ${settings.subtitlesEnabled ? "bg-zinc-100" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${settings.subtitlesEnabled ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-zinc-300"}`}
            />
          </button>
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
            <span className="text-xs text-zinc-500">Preferred audio track</span>
          </div>
          <LanguageDropdown
            value={settings.defaultAudioLanguage}
            onChange={(v) => update.mutate({ defaultAudioLanguage: v })}
          />
        </div>
      </div>
    </section>
  );
}
