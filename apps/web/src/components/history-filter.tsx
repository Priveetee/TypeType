import { useState } from "react";
import { HistoryCalendar } from "./history-calendar";

export type FilterState =
  | { kind: "preset"; value: "today" | "week" | "month" }
  | { kind: "date"; date: Date };

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: FilterState | null;
  onFilterChange: (value: FilterState | null) => void;
  resultCount: number;
};

const PRESET_OPTIONS = [
  { label: "Today", value: "today" as const },
  { label: "This week", value: "week" as const },
  { label: "This month", value: "month" as const },
];

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Search"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function HistoryFilter({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  resultCount,
}: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const hasActiveFilter = searchQuery.length > 0 || filter !== null;

  const isPresetActive = (value: string) => filter?.kind === "preset" && filter.value === value;

  const selectedDate = filter?.kind === "date" ? filter.date : null;

  const olderActive = filter?.kind === "date" || calendarOpen;

  const handlePreset = (value: "today" | "week" | "month") => {
    setCalendarOpen(false);
    onFilterChange(isPresetActive(value) ? null : { kind: "preset", value });
  };

  const handleOlderToggle = () => {
    if (calendarOpen) {
      setCalendarOpen(false);
      if (filter?.kind === "date") onFilterChange(null);
    } else {
      setCalendarOpen(true);
      onFilterChange(null);
    }
  };

  const handleDateSelect = (date: Date) => {
    onFilterChange({ kind: "date", date });
  };

  const handleClear = () => {
    onSearchChange("");
    onFilterChange(null);
    setCalendarOpen(false);
  };

  return (
    <aside className="w-52 flex-shrink-0 hidden lg:flex flex-col gap-5 sticky top-20 self-start">
      <div>
        <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2.5">
          {resultCount} {resultCount === 1 ? "video" : "videos"}
        </p>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search history..."
            className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      <div>
        <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2">Date</p>
        <div className="flex flex-col gap-0.5">
          {PRESET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePreset(opt.value)}
              className={`h-8 px-2.5 rounded-lg text-xs text-left transition-colors ${
                isPresetActive(opt.value)
                  ? "bg-zinc-100 text-zinc-950 font-medium"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleOlderToggle}
            className={`h-8 px-2.5 rounded-lg text-xs text-left transition-colors ${
              olderActive
                ? "bg-zinc-100 text-zinc-950 font-medium"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            {selectedDate ? formatDate(selectedDate) : "Older"}
          </button>

          {calendarOpen && <HistoryCalendar selected={selectedDate} onSelect={handleDateSelect} />}
        </div>
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors text-left"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
