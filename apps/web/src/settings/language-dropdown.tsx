import { useEffect, useRef, useState } from "react";
import { FlagIcon } from "../components/flag-icon";
import { LANGUAGES } from "../lib/languages";

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

type Props = {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
};

export function LanguageDropdown({ value, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = LANGUAGES.find((language) => language.code === value);
  const label = selected ? selected.label.split(" — ")[0] : "No preference";
  const normalizedQuery = query.toLowerCase();
  const filtered =
    query.trim() === ""
      ? LANGUAGES
      : LANGUAGES.filter(
          (language) =>
            language.label.toLowerCase().includes(normalizedQuery) ||
            language.code.toLowerCase().includes(normalizedQuery),
        );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 0);
    function onMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div ref={ref} className="relative ml-6 flex-shrink-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center gap-2 bg-surface-strong border border-border-strong text-xs rounded-lg px-3 py-1.5 transition-colors ${disabled ? "text-fg-soft cursor-not-allowed" : "text-fg hover:bg-surface-soft"}`}
      >
        {selected?.flag && (
          <FlagIcon code={selected.flag} className="w-4 h-3 rounded-sm flex-shrink-0" />
        )}
        {label}
        {CHEVRON}
      </button>
      {open && !disabled && (
        <div className="absolute right-0 top-full mt-1 bg-surface-strong border border-border-strong rounded-lg overflow-hidden z-10 w-56 shadow-lg flex flex-col">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search language..."
            className="px-3 py-2 text-xs bg-surface-strong text-fg placeholder:text-fg-soft border-b border-border-strong focus:outline-none"
          />
          <div className="overflow-y-auto max-h-52">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs transition-colors ${value === "" ? "text-fg bg-surface-soft" : "text-fg-muted hover:bg-surface-soft hover:text-fg"}`}
            >
              No preference
            </button>
            {filtered.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => {
                  onChange(language.code);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs transition-colors ${language.code === value ? "text-fg bg-surface-soft" : "text-fg-muted hover:bg-surface-soft hover:text-fg"}`}
              >
                {language.flag && (
                  <FlagIcon code={language.flag} className="w-4 h-3 rounded-sm flex-shrink-0" />
                )}
                {language.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
