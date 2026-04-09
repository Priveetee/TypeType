import { formatTimestamp } from "../lib/bug-report-utils";
import type { BugReportDetail } from "../types/bug-report";

type Props = {
  report: BugReportDetail;
};

export function AdminBugReportOverview({ report }: Props) {
  return (
    <section className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">Issue</p>
        <span className="text-xs text-zinc-500">{formatTimestamp(report.createdAt)}</span>
      </div>
      <p className="text-sm capitalize text-zinc-300">{report.status.replace("_", " ")}</p>
      <p className="whitespace-pre-wrap text-sm text-zinc-200">{report.description}</p>
      <p className="text-xs text-zinc-500">
        {report.category.replace("_", " ")} · {report.userEmail}
      </p>
      {report.context.videoUrl && (
        <p className="truncate text-xs text-zinc-500">{report.context.videoUrl}</p>
      )}
    </section>
  );
}
