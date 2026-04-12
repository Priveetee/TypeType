import { useMemo, useState } from "react";
import type { BugReportDetail } from "../types/bug-report";
import { AdminBugReportDiagnosticsDetails } from "./admin-bug-report-diagnostics-details";
import { AdminBugReportDiagnosticsMeta } from "./admin-bug-report-diagnostics-meta";

type Props = {
  report: BugReportDetail;
};

export function AdminBugReportDiagnostics({ report }: Props) {
  const [copied, setCopied] = useState(false);
  const diagnosticsJson = useMemo(() => JSON.stringify(report.context, null, 2), [report.context]);

  async function copyDiagnostics() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(diagnosticsJson);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="space-y-3 border-t border-border pt-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-soft">Diagnostics</p>
        <button
          type="button"
          onClick={copyDiagnostics}
          className="rounded border border-border-strong px-2 py-1 text-xs text-fg-muted hover:border-border-strong hover:text-fg"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
      <AdminBugReportDiagnosticsMeta report={report} />
      <AdminBugReportDiagnosticsDetails report={report} />
    </section>
  );
}
