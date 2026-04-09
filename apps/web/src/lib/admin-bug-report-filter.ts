import type { BugReportCategory, BugReportListItem, BugReportStatus } from "../types/bug-report";

type Params = {
  status?: BugReportStatus;
  category?: BugReportCategory;
  query: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function filterBugReports(items: BugReportListItem[], params: Params): BugReportListItem[] {
  const q = normalize(params.query);
  return items.filter((report) => {
    if (params.status && report.status !== params.status) return false;
    if (params.category && report.category !== params.category) return false;
    if (!q) return true;
    const haystack = [
      report.id,
      report.userEmail,
      report.description,
      report.category,
      report.status,
      report.githubIssueUrl ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
