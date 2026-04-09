import { formatTimestamp } from "../lib/bug-report-utils";
import type { BugReportDetail } from "../types/bug-report";

type Props = {
  report: BugReportDetail;
};

function shorten(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

export function AdminBugReportDiagnosticsMeta({ report }: Props) {
  return (
    <div className="space-y-1 text-xs text-zinc-500">
      <p>Route: {report.context.route || "unknown"}</p>
      <p>Language: {report.context.browserLanguage || "unknown"}</p>
      <p title={report.context.userAgent || ""}>
        User agent: {shorten(report.context.userAgent || "unknown", 110)}
      </p>
      <p>
        Crash logs: {report.context.crashLogs.length} · API errors:{" "}
        {report.context.apiErrors.length}
      </p>
      <p>Captured at: {formatTimestamp(report.context.timestamp)}</p>
    </div>
  );
}
