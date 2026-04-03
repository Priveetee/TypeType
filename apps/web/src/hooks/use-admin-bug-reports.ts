import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGitHubIssue,
  fetchBugReportDetail,
  fetchBugReports,
  updateBugReportStatus,
} from "../lib/api-bug-reports";
import type { BugReportCategory, BugReportStatus } from "../types/bug-report";

const KEY = ["admin-bug-reports"];

type ListParams = {
  page: number;
  limit: number;
  status?: BugReportStatus;
  category?: BugReportCategory;
};

function listKey(params: ListParams) {
  return [...KEY, "list", params.page, params.limit, params.status, params.category];
}

function detailKey(id: string) {
  return [...KEY, "detail", id];
}

export function useAdminBugReports(enabled: boolean, params: ListParams) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: listKey(params),
    queryFn: () => fetchBugReports(params),
    enabled,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BugReportStatus }) =>
      updateBugReportStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const createIssue = useMutation({
    mutationFn: (id: string) => createGitHubIssue(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, updateStatus, createIssue };
}

export function useAdminBugReportDetail(enabled: boolean, id: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: detailKey(id),
    queryFn: () => fetchBugReportDetail(id),
    enabled: enabled && id.length > 0,
  });

  const updateStatus = useMutation({
    mutationFn: (status: BugReportStatus) => updateBugReportStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  const createIssue = useMutation({
    mutationFn: () => createGitHubIssue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  return { query, updateStatus, createIssue };
}
