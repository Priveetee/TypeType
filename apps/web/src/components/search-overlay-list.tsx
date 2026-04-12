import type { RefObject } from "react";

export type SearchOverlayItem = {
  key: string;
  label: string;
};

type Props = {
  items: SearchOverlayItem[];
  showHistory: boolean;
  selectedIndex: number;
  listRef: RefObject<HTMLUListElement | null>;
  onScroll: (e: React.UIEvent<HTMLUListElement>) => void;
  onClearAll: () => void;
  onSelect: (term: string) => void;
};

export function SearchOverlayList({
  items,
  showHistory,
  selectedIndex,
  listRef,
  onScroll,
  onClearAll,
  onSelect,
}: Props) {
  if (items.length === 0) return null;

  return (
    <ul
      ref={listRef}
      onScroll={onScroll}
      className="mt-1 max-h-[22rem] overflow-y-auto scroll-smooth bg-surface border border-border-strong rounded-lg"
    >
      {showHistory && (
        <li className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-fg-soft uppercase tracking-wider">Recent searches</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-fg-soft hover:text-fg-muted transition-colors"
          >
            Clear all
          </button>
        </li>
      )}
      {items.map((item, index) => (
        <li
          key={item.key}
          className="animate-card-pop-in"
          style={{ animationDelay: `${Math.min(index * 24, 168)}ms` }}
        >
          <button
            type="button"
            data-item-index={index}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
              index === selectedIndex
                ? "bg-surface-soft text-fg"
                : "text-fg-muted hover:bg-surface-strong"
            }`}
            onClick={() => onSelect(item.label)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
