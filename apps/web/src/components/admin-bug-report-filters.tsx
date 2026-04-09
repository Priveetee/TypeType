import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../lib/bug-report-utils";
import type { BugReportCategory, BugReportStatus } from "../types/bug-report";

type Props = {
  statusFilter: BugReportStatus | undefined;
  categoryFilter: BugReportCategory | undefined;
  searchText: string;
  onStatusChange: (value: BugReportStatus | undefined) => void;
  onCategoryChange: (value: BugReportCategory | undefined) => void;
  onSearchChange: (value: string) => void;
};

export function AdminBugReportFilters({
  statusFilter,
  categoryFilter,
  searchText,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <input
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search id, email, text..."
        className="rounded border border-zinc-700 bg-transparent px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500"
      />
      <select
        value={statusFilter ?? ""}
        onChange={(e) =>
          onStatusChange(e.target.value ? (e.target.value as BugReportStatus) : undefined)
        }
        className="rounded border border-zinc-700 bg-transparent px-2 py-1.5 text-sm text-zinc-100"
      >
        <option value="" className="bg-zinc-100 text-zinc-900">
          All Statuses
        </option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-100 text-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={categoryFilter ?? ""}
        onChange={(e) =>
          onCategoryChange(e.target.value ? (e.target.value as BugReportCategory) : undefined)
        }
        className="rounded border border-zinc-700 bg-transparent px-2 py-1.5 text-sm text-zinc-100"
      >
        <option value="" className="bg-zinc-100 text-zinc-900">
          All Categories
        </option>
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-100 text-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
