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
      className="mt-1 max-h-[22rem] overflow-y-auto scroll-smooth bg-zinc-900 border border-zinc-700 rounded-lg"
    >
      {showHistory && (
        <li className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Recent searches</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
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
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-300 hover:bg-zinc-800"
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
