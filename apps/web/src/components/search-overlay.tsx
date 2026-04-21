import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useSearchHistory } from "../hooks/use-search-history";
import { useSearchOverlayNavigation } from "../hooks/use-search-overlay-navigation";
import { fetchSuggestions } from "../lib/api";
import { buildSearchOverlayItems } from "../lib/search-overlay-items";
import {
  resolveInitialSearchOverlayQuery,
  writeSearchOverlayQuery,
} from "../lib/search-overlay-query";
import { ConfirmModal } from "./confirm-modal";
import { SearchOverlayList } from "./search-overlay-list";

type Props = {
  onClose: () => void;
};

export function SearchOverlay({ onClose }: Props) {
  const location = useRouterState({ select: (state) => state.location });
  const [query, setQuery] = useState(() =>
    resolveInitialSearchOverlayQuery(location.pathname, location.searchStr),
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { service, navigateAndClose } = useSearchOverlayNavigation({ onClose });
  const { visibleItems, canLoadMore, loadMore, clear } = useSearchHistory();
  const debouncedQuery = useDebouncedValue(query, 300);
  const items = buildSearchOverlayItems(query, visibleItems, suggestions);

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

  const showHistory = query.trim().length === 0 && visibleItems.length > 0;

  function submitTerm(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    writeSearchOverlayQuery(trimmed);
    navigateAndClose(trimmed);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIndex >= 0 && items[selectedIndex]) {
      submitTerm(items[selectedIndex].label);
      return;
    }
    submitTerm(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((index) => (index >= items.length - 1 ? 0 : index + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((index) => (index <= 0 ? items.length - 1 : index - 1));
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
              writeSearchOverlayQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search videos, channels..."
            className="w-full h-14 bg-surface border border-border-strong rounded-xl px-5 text-lg text-fg placeholder-zinc-500 focus:outline-none focus:border-border-strong"
          />
        </form>
        <SearchOverlayList
          items={items}
          showHistory={showHistory}
          selectedIndex={selectedIndex}
          listRef={listRef}
          onScroll={handleHistoryScroll}
          onClearAll={() => setConfirmClearOpen(true)}
          onSelect={submitTerm}
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
