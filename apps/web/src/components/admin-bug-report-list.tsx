import { formatTimestamp } from "../lib/bug-report-utils";
import type { BugReportListItem } from "../types/bug-report";

type Props = {
  reports: BugReportListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function trimDescription(value: string): string {
  if (value.length <= 90) return value;
  return `${value.slice(0, 90)}...`;
}

export function AdminBugReportList({ reports, selectedId, onSelect }: Props) {
  if (reports.length === 0) return <p className="text-sm text-zinc-500">No bug reports found.</p>;

  return (
    <div className="max-h-[68svh] space-y-2 overflow-y-auto pr-1">
      {reports.map((report) => {
        const selected = selectedId === report.id;
        return (
          <button
            key={report.id}
            type="button"
            onClick={() => onSelect(report.id)}
            className={`w-full border-l-2 px-3 py-2 text-left ${selected ? "border-zinc-200 bg-zinc-900/70" : "border-zinc-700 hover:border-zinc-400"}`}
          >
            <p className="text-sm text-zinc-100">{trimDescription(report.description)}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {report.category.replace("_", " ")} · {report.userEmail}
            </p>
            <p className="text-xs text-zinc-600">{formatTimestamp(report.createdAt)}</p>
          </button>
        );
      })}
    </div>
  );
}
