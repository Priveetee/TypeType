import { formatTimestamp } from "../lib/bug-report-utils";
import type { BugReportDetail } from "../types/bug-report";

type Props = {
  report: BugReportDetail;
};

export function AdminBugReportOverview({ report }: Props) {
  return (
    <section className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-soft">Issue</p>
        <span className="text-xs text-fg-soft">{formatTimestamp(report.createdAt)}</span>
      </div>
      <p className="text-sm capitalize text-fg-muted">{report.status.replace("_", " ")}</p>
      <p className="whitespace-pre-wrap text-sm text-fg">{report.description}</p>
      <p className="text-xs text-fg-soft">
        {report.category.replace("_", " ")} · {report.userEmail}
      </p>
      {report.context.videoUrl && (
        <p className="truncate text-xs text-fg-soft">{report.context.videoUrl}</p>
      )}
    </section>
  );
}
