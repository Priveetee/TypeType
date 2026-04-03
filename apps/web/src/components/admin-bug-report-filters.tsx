import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../lib/bug-report-utils";
import type { BugReportCategory, BugReportStatus } from "../types/bug-report";

type Props = {
  statusFilter: BugReportStatus | undefined;
  categoryFilter: BugReportCategory | undefined;
  onStatusChange: (value: BugReportStatus | undefined) => void;
  onCategoryChange: (value: BugReportCategory | undefined) => void;
};

export function AdminBugReportFilters({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={statusFilter ?? ""}
        onChange={(e) =>
          onStatusChange(e.target.value ? (e.target.value as BugReportStatus) : undefined)
        }
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={categoryFilter ?? ""}
        onChange={(e) =>
          onCategoryChange(e.target.value ? (e.target.value as BugReportCategory) : undefined)
        }
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100"
      >
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
