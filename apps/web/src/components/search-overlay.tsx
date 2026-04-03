import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useSearchHistory } from "../hooks/use-search-history";
import { useSettings } from "../hooks/use-settings";
import { fetchSuggestions } from "../lib/api";
import { ConfirmModal } from "./confirm-modal";
import type { SearchOverlayItem } from "./search-overlay-list";
import { SearchOverlayList } from "./search-overlay-list";

type Props = {
  onClose: () => void;
};

export function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const service = settings.defaultService;
  const { visibleItems, canLoadMore, loadMore, add, clear } = useSearchHistory();
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (selectedIndex < 0) return;
    const element = listRef.current?.querySelector<HTMLButtonElement>(
      `button[data-item-index="${selectedIndex}"]`,
    );
    element?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  const showSuggestions = query.trim().length > 0 && suggestions.length > 0;
  const showHistory = query.trim().length === 0 && visibleItems.length > 0;
  const items: SearchOverlayItem[] = showHistory
    ? visibleItems.map((item) => ({ key: item.id, label: item.term }))
    : showSuggestions
      ? suggestions.slice(0, 8).map((term) => ({ key: term, label: term }))
      : [];

  function navigateAndClose(term: string) {
    add.mutate(term);
    navigate({ to: "/search", search: { q: term, service } });
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIndex >= 0 && items[selectedIndex]) {
      navigateAndClose(items[selectedIndex].label);
      return;
    }
    if (!query.trim()) return;
    navigateAndClose(query.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    }
  }

  function handleHistoryScroll(e: React.UIEvent<HTMLUListElement>) {
    if (!showHistory || !canLoadMore) return;
    const target = e.currentTarget;
    const threshold = target.scrollHeight - target.clientHeight - 24;
    if (target.scrollTop >= threshold) {
      loadMore();
    }
  }

  function handleConfirmClear() {
    clear.mutate();
    setConfirmClearOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close search"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl flex flex-col">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search videos, channels..."
            className="w-full h-14 bg-zinc-900 border border-zinc-700 rounded-xl px-5 text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />
        </form>
        <SearchOverlayList
          items={items}
          showHistory={showHistory}
          selectedIndex={selectedIndex}
          listRef={listRef}
          onScroll={handleHistoryScroll}
          onClearAll={() => setConfirmClearOpen(true)}
          onSelect={navigateAndClose}
        />
      </div>
      {confirmClearOpen && (
        <ConfirmModal
          title="Clear search history?"
          description="This removes all saved searches from your account."
          confirmLabel="Clear all"
          onConfirm={handleConfirmClear}
          onCancel={() => setConfirmClearOpen(false)}
        />
      )}
    </div>
  );
}
