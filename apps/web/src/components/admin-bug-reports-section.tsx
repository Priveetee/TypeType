import { useEffect, useState } from "react";
import { useAdminBugReportDetail, useAdminBugReports } from "../hooks/use-admin-bug-reports";
import type { BugReportCategory, BugReportStatus } from "../types/bug-report";
import { AdminBugReportDetailPanel } from "./admin-bug-report-detail";
import { AdminBugReportFilters } from "./admin-bug-report-filters";
import { AdminBugReportList } from "./admin-bug-report-list";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { query, updateStatus, createIssue } = useAdminBugReports(enabled, {
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
    category: categoryFilter,
  });

  const reports = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { query: detailQuery } = useAdminBugReportDetail(enabled && !!selectedId, selectedId ?? "");

  useEffect(() => {
    if (reports.length > 0 && !selectedId) {
      setSelectedId(reports[0].id);
    }
  }, [reports, selectedId]);

  const busy = updateStatus.isPending || createIssue.isPending;

  return (
    <div className="flex flex-col gap-4">
      <AdminBugReportFilters
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        onCategoryChange={(v) => {
          setCategoryFilter(v);
          setPage(1);
        }}
      />

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          {total} report{total !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 rounded bg-zinc-800 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 rounded bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {query.isPending && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-center text-sm text-zinc-400">
          Loading bug reports...
        </div>
      )}

      {query.isError && (
        <div className="rounded-lg border border-red-900 bg-red-950/30 p-6 text-center text-sm text-red-300">
          Unable to load bug reports.
        </div>
      )}

      {!query.isPending && !query.isError && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
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
            <div className="hidden lg:block" />
          )}
        </div>
      )}
    </div>
  );
}
