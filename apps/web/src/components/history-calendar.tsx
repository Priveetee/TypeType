import { useState } from "react";
import { CalendarHeader } from "./history-calendar-header";

type Props = {
  selected: Date | null;
  onSelect: (date: Date) => void;
};

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function HistoryCalendar({ selected, onSelect }: Props) {
  const today = startOfDay(new Date());

  const initialMonth = selected
    ? new Date(selected.getFullYear(), selected.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);

  const [viewMonth, setViewMonth] = useState(initialMonth);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const canGoNext =
    new Date(year, month + 1, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => {
    if (canGoNext) setViewMonth(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (m: number) => {
    const clamped = year === today.getFullYear() && m > today.getMonth() ? today.getMonth() : m;
    setViewMonth(new Date(year, clamped, 1));
  };

  const handleYearChange = (y: number) => {
    const clampedMonth =
      y === today.getFullYear() && month > today.getMonth() ? today.getMonth() : month;
    setViewMonth(new Date(y, clampedMonth, 1));
  };

  const emptySlots = Array.from({ length: firstDayOffset }, (_, i) => `slot-${i}`);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mt-2 select-none">
      <CalendarHeader
        month={month}
        year={year}
        canGoNext={canGoNext}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      <div className="grid grid-cols-7 gap-y-0.5">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-zinc-600 py-0.5">
            {d}
          </div>
        ))}

        {emptySlots.map((key) => (
          <div key={key} />
        ))}

        {days.map((day) => {
          const cellDate = new Date(year, month, day);
          const isFuture = cellDate > today;
          const isSelected = selected !== null && isSameDay(cellDate, selected);
          const isToday = isSameDay(cellDate, today);

          return (
            <button
              key={day}
              type="button"
              disabled={isFuture}
              onClick={() => onSelect(cellDate)}
              className={`h-7 w-full rounded text-xs transition-colors ${
                isSelected
                  ? "bg-zinc-100 text-zinc-950 font-medium"
                  : isToday
                    ? "text-zinc-100 ring-1 ring-zinc-600 hover:bg-zinc-800"
                    : isFuture
                      ? "text-zinc-700 cursor-not-allowed"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
