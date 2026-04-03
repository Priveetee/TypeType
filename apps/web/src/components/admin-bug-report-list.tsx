import { formatTimestamp, statusColor } from "../lib/bug-report-utils";
import type { BugReportListItem } from "../types/bug-report";

type Props = {
  reports: BugReportListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AdminBugReportList({ reports, selectedId, onSelect }: Props) {
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-center text-sm text-zinc-400">
        No bug reports found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {reports.map((report) => (
        <button
          key={report.id}
          type="button"
          onClick={() => onSelect(report.id)}
          className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
            selectedId === report.id
              ? "border-blue-600 bg-blue-950/30"
              : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
          }`}
        >
          <span
            className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${statusColor(report.status)}`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm font-medium text-zinc-100">
              {report.description.slice(0, 80)}
              {report.description.length > 80 ? "..." : ""}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="capitalize">{report.category.replace("_", " ")}</span>
              <span>|</span>
              <span>{report.userEmail}</span>
              <span>|</span>
              <span>{formatTimestamp(report.createdAt)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
