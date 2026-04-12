import { useEffect, useState } from "react";
import { useAdminBugReportDetail, useAdminBugReports } from "../hooks/use-admin-bug-reports";
import { filterBugReports } from "../lib/admin-bug-report-filter";
import type { BugReportCategory, BugReportStatus } from "../types/bug-report";
import { AdminBugReportDetailPanel } from "./admin-bug-report-detail";
import { AdminBugReportFilters } from "./admin-bug-report-filters";
import { AdminBugReportList } from "./admin-bug-report-list";
import { AdminBugReportPager } from "./admin-bug-report-pager";

const PAGE_SIZE = 20;

type Props = {
  enabled: boolean;
  isAdmin: boolean;
  onToast: (message: string) => void;
};

export function AdminBugReportsSection({ enabled, isAdmin, onToast }: Props) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BugReportStatus | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<BugReportCategory | undefined>();
  const [searchText, setSearchText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { query, updateStatus, createIssue } = useAdminBugReports(enabled, {
    page,
    limit: PAGE_SIZE,
  });
  const reports = filterBugReports(query.data?.items ?? [], {
    status: statusFilter,
    category: categoryFilter,
    query: searchText,
  });
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const { query: detailQuery } = useAdminBugReportDetail(enabled && !!selectedId, selectedId ?? "");

  useEffect(() => {
    if (reports.length > 0 && !selectedId) setSelectedId(reports[0].id);
  }, [reports, selectedId]);

  const busy = updateStatus.isPending || createIssue.isPending;

  return (
    <div className="flex flex-col gap-4">
      <AdminBugReportFilters
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        searchText={searchText}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        onCategoryChange={(v) => {
          setCategoryFilter(v);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearchText(value);
          setSelectedId(null);
        }}
      />
      <AdminBugReportPager
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />

      {query.isPending && <p className="text-sm text-fg-muted">Loading bug reports...</p>}
      {query.isError && <p className="text-sm text-danger-strong">Unable to load bug reports.</p>}

      {!query.isPending && !query.isError && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <AdminBugReportList reports={reports} selectedId={selectedId} onSelect={setSelectedId} />
          {detailQuery.data ? (
            <AdminBugReportDetailPanel
              report={detailQuery.data}
              busy={busy}
              isAdmin={isAdmin}
              onStatusChange={(status) => {
                updateStatus.mutate(
                  { id: detailQuery.data.id, status },
                  {
                    onSuccess: () => onToast("Status updated"),
                    onError: (e) => onToast(e instanceof Error ? e.message : "Failed to update"),
                  },
                );
              }}
              onCreateIssue={() => {
                createIssue.mutate(detailQuery.data.id, {
                  onSuccess: () => onToast("GitHub issue created"),
                  onError: (e) =>
                    onToast(e instanceof Error ? e.message : "Failed to create issue"),
                });
              }}
            />
          ) : (
            <p className="text-sm text-fg-soft">Select a report to inspect details.</p>
          )}
        </div>
      )}
    </div>
  );
}
