import { ExternalLink } from "lucide-react";
import type { BugReportDetail } from "../types/bug-report";

type Props = {
  report: BugReportDetail;
  busy: boolean;
  isAdmin: boolean;
  onCreateIssue: () => void;
};

export function AdminBugReportGitHubAction({ report, busy, isAdmin, onCreateIssue }: Props) {
  if (!isAdmin) return null;
  if (report.githubIssueUrl) {
    return (
      <a
        href={report.githubIssueUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:border-zinc-500"
      >
        <ExternalLink className="h-4 w-4" />
        View GitHub Issue
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onCreateIssue}
      className="rounded bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-50"
    >
      Create GitHub Issue
    </button>
  );
}
