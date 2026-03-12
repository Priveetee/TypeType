import { useState } from "react";
import { ChevronLeft, ChevronRight } from "./history-calendar-icons";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);

type Props = {
  month: number;
  year: number;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

export function CalendarHeader({
  month,
  year,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
}: Props) {
  const [dropdown, setDropdown] = useState<"month" | "year" | null>(null);

  const toggle = (which: "month" | "year") => setDropdown(dropdown === which ? null : which);

  const close = () => setDropdown(null);

  const handleMonthSelect = (m: number) => {
    onMonthChange(m);
    close();
  };
  const handleYearSelect = (y: number) => {
    onYearChange(y);
    close();
  };

  return (
    <div className="relative flex items-center justify-between mb-2">
      {dropdown && (
        <button
          type="button"
          onClick={close}
          className="fixed inset-0 z-10"
          aria-label="Close picker"
          tabIndex={-1}
        />
      )}

      <button
        type="button"
        onClick={onPrevMonth}
        className="relative z-20 p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
      >
        <ChevronLeft />
      </button>

      <div className="relative z-20 flex items-center gap-0.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("month")}
            className="text-xs font-medium text-zinc-300 hover:text-zinc-100 px-1 py-0.5 rounded transition-colors"
          >
            {MONTH_NAMES[month]}
          </button>
          {dropdown === "month" && (
            <div className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 grid grid-cols-3 gap-0.5 shadow-xl">
              {MONTH_NAMES.map((name, m) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleMonthSelect(m)}
                  className={`text-[11px] px-1 py-1.5 rounded transition-colors ${
                    m === month
                      ? "bg-zinc-100 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("year")}
            className="text-xs font-medium text-zinc-300 hover:text-zinc-100 px-1 py-0.5 rounded transition-colors"
          >
            {year}
          </button>
          {dropdown === "year" && (
            <div className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 w-20 max-h-36 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg p-1 shadow-xl">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => handleYearSelect(y)}
                  className={`w-full text-[11px] px-2 py-1 rounded transition-colors text-left ${
                    y === year
                      ? "bg-zinc-100 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onNextMonth}
        disabled={!canGoNext}
        className={`relative z-20 p-1 rounded transition-colors ${
          canGoNext
            ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            : "text-zinc-700 cursor-not-allowed"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
