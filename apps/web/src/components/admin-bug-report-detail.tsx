import { ExternalLink } from "lucide-react";
import { formatTimestamp, STATUS_OPTIONS, statusColor } from "../lib/bug-report-utils";
import type { BugReportDetail, BugReportStatus } from "../types/bug-report";

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
  const hasGitHubIssue = !!report.githubIssueUrl;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor(report.status)}`} />
          <span className="text-sm font-medium capitalize text-zinc-100">
            {report.status.replace("_", " ")}
          </span>
        </div>
        <span className="text-xs text-zinc-500">{formatTimestamp(report.createdAt)}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500">Description</span>
        <p className="text-sm text-zinc-200 whitespace-pre-wrap">{report.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-xs text-zinc-500">Category</span>
          <p className="capitalize text-zinc-200">{report.category.replace("_", " ")}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-500">User</span>
          <p className="truncate text-zinc-200">{report.userEmail}</p>
        </div>
      </div>

      {report.context.videoUrl && (
        <div>
          <span className="text-xs text-zinc-500">Video URL</span>
          <p className="truncate text-sm text-blue-400">{report.context.videoUrl}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">Update Status</span>
        <select
          value={report.status}
          disabled={busy}
          onChange={(e) => onStatusChange(e.target.value as BugReportStatus)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3">
          {hasGitHubIssue ? (
            <a
              href={report.githubIssueUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
            >
              <ExternalLink className="h-4 w-4" />
              View GitHub Issue
            </a>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={onCreateIssue}
              className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-50"
            >
              Create GitHub Issue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
