import { useEffect, useRef, useState } from "react";
import { useSettings } from "../hooks/use-settings";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD = "bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

const QUALITY_OPTIONS = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];

type DropdownProps = {
  value: string;
  onChange: (q: string) => void;
};

function QualityDropdown({ value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-1.5 hover:bg-zinc-700 transition-colors"
      >
        {value}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          role="img"
          aria-label="toggle"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden z-10 min-w-[72px] shadow-lg">
          {QUALITY_OPTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                onChange(q);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs transition-colors ${
                q === value
                  ? "text-zinc-100 bg-zinc-700"
                  : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <QualityDropdown
            value={settings.defaultQuality}
            onChange={(q) => update.mutate({ defaultQuality: q })}
          />
        </div>
      </div>
    </section>
  );
}
