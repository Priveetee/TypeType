import type {
  BugReportCategory,
  BugReportDetail,
  BugReportListResponse,
  BugReportStatus,
  CreateBugReportRequest,
  CreateBugReportResponse,
  CreateGitHubIssueResponse,
  UpdateStatusResponse,
} from "../types/bug-report";
import { ApiError } from "./api";
import { recordApiError } from "./api-error-log";
import { authed, authedJson } from "./authed";
import { extractRequestId, recordClientEvent } from "./client-debug-log";
import { sanitizeDebugText, sanitizeRequestPath } from "./debug-sanitize";
import { API_BASE as BASE } from "./env";
import { normalizeApiPayload } from "./text-normalize";

export async function submitBugReport(
  request: CreateBugReportRequest,
): Promise<CreateBugReportResponse> {
  const endpoint = `${BASE}/bug-reports`;
  const res = await authed(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const body = normalizeApiPayload((await res.json()) as CreateBugReportResponse);
  if (!res.ok) {
    const requestId = extractRequestId(res.headers);
    const message = (body as unknown as { error: string }).error ?? "Failed";
    recordApiError({
      endpoint,
      status: res.status,
      code: "BUG_REPORT_SUBMIT_ERROR",
      message,
      requestId,
    });
    recordClientEvent("bug.report_submit_error", {
      method: "POST",
      path: sanitizeRequestPath(endpoint),
      status: res.status,
      requestId,
      message: sanitizeDebugText(message),
    });
    throw new ApiError(
      (body as unknown as { error: string }).error ?? "Failed to submit report",
      res.status,
    );
  }
  recordClientEvent("bug.report_submit_success", {
    method: "POST",
    path: sanitizeRequestPath(endpoint),
    status: res.status,
  });
  return body as CreateBugReportResponse;
}

type FetchBugReportsParams = {
  page: number;
  limit: number;
  status?: BugReportStatus;
  category?: BugReportCategory;
};

export async function fetchBugReports(
  params: FetchBugReportsParams,
): Promise<BugReportListResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.status) search.set("status", params.status);
  if (params.category) search.set("category", params.category);

  return authedJson<BugReportListResponse>(`${BASE}/admin/bug-reports?${search}`);
}

export async function fetchBugReportDetail(id: string): Promise<BugReportDetail> {
  return authedJson<BugReportDetail>(`${BASE}/admin/bug-reports/${encodeURIComponent(id)}`);
}

export async function updateBugReportStatus(
  id: string,
  status: BugReportStatus,
): Promise<UpdateStatusResponse> {
  const endpoint = `${BASE}/admin/bug-reports/${encodeURIComponent(id)}/status`;
  const res = await authed(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const body = normalizeApiPayload((await res.json()) as UpdateStatusResponse);
  if (!res.ok) {
    const requestId = extractRequestId(res.headers);
    const message = (body as unknown as { error: string }).error ?? "Failed";
    recordApiError({
      endpoint,
      status: res.status,
      code: "BUG_REPORT_STATUS_UPDATE_ERROR",
      message,
      requestId,
    });
    recordClientEvent("bug.report_status_update_error", {
      method: "PUT",
      path: sanitizeRequestPath(endpoint),
      status: res.status,
      requestId,
      message: sanitizeDebugText(message),
    });
    throw new ApiError(
      (body as unknown as { error: string }).error ?? "Failed to update status",
      res.status,
    );
  }
  return body as UpdateStatusResponse;
}

export async function createGitHubIssue(id: string): Promise<CreateGitHubIssueResponse> {
  const endpoint = `${BASE}/admin/bug-reports/${encodeURIComponent(id)}/github-issue`;
  const res = await authed(endpoint, {
    method: "POST",
  });
  const body = normalizeApiPayload(
    (await res.json()) as CreateGitHubIssueResponse | { error: string; githubIssueUrl?: string },
  );
  if (!res.ok) {
    const errorBody = body as { error: string; githubIssueUrl?: string };
    const requestId = extractRequestId(res.headers);
    const message = errorBody.error ?? "Failed";
    recordApiError({
      endpoint,
      status: res.status,
      code: "BUG_GITHUB_ISSUE_ERROR",
      message,
      requestId,
    });
    recordClientEvent("bug.github_issue_error", {
      method: "POST",
      path: sanitizeRequestPath(endpoint),
      status: res.status,
      requestId,
      message: sanitizeDebugText(message),
    });
    throw new ApiError(errorBody.error ?? "Failed to create GitHub issue", res.status);
  }
  recordClientEvent("bug.github_issue_success", {
    method: "POST",
    path: sanitizeRequestPath(endpoint),
    status: res.status,
  });
  return body as CreateGitHubIssueResponse;
}
