import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSearchHistory } from "../hooks/use-search-history";
import { useSettings } from "../hooks/use-settings";
import { fetchSuggestions } from "../lib/api";

type Props = {
  onClose: () => void;
};

function useDebounced(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const service = settings.defaultService;
  const { query: historyQuery, add } = useSearchHistory();
  const history = historyQuery.data ?? [];
  const debouncedQuery = useDebounced(query, 300);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    fetchSuggestions(debouncedQuery.trim(), service)
      .then((s) => {
        if (!cancelled) setSuggestions(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, service]);

  function navigate_and_close(term: string) {
    add.mutate(term);
    navigate({ to: "/search", search: { q: term, service } });
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate_and_close(query.trim());
  }

  const showSuggestions = query.trim().length > 0 && suggestions.length > 0;
  const showHistory = query.trim().length === 0 && history.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl flex flex-col">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, channels..."
            className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-lg px-4 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />
        </form>
        {(showSuggestions || showHistory) && (
          <ul className="mt-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            {showHistory && (
              <>
                <li className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider">
                  Recent searches
                </li>
                {history.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                      onClick={() => navigate_and_close(item.term)}
                    >
                      {item.term}
                    </button>
                  </li>
                ))}
              </>
            )}
            {showSuggestions &&
              suggestions.slice(0, 8).map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    onClick={() => navigate_and_close(s)}
                  >
                    {s}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
