import type { BugReportDetail, BugReportStatus } from "../types/bug-report";
import { AdminBugReportDiagnostics } from "./admin-bug-report-diagnostics";
import { AdminBugReportGitHubAction } from "./admin-bug-report-github-action";
import { AdminBugReportOverview } from "./admin-bug-report-overview";
import { AdminBugReportStatusControl } from "./admin-bug-report-status-control";

type Props = {
  report: BugReportDetail;
  busy: boolean;
  isAdmin: boolean;
  onStatusChange: (status: BugReportStatus) => void;
  onCreateIssue: () => void;
};

export function AdminBugReportDetailPanel({
  report,
  busy,
  isAdmin,
  onStatusChange,
  onCreateIssue,
}: Props) {
  return (
    <div className="space-y-5 border-t border-border pt-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
      <AdminBugReportOverview report={report} />
      <AdminBugReportStatusControl report={report} busy={busy} onStatusChange={onStatusChange} />
      <AdminBugReportGitHubAction
        report={report}
        busy={busy}
        isAdmin={isAdmin}
        onCreateIssue={onCreateIssue}
      />
      <AdminBugReportDiagnostics report={report} />
    </div>
  );
}
