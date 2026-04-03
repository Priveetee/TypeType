import { useMutation } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { submitBugReport } from "../lib/api-bug-reports";
import { clearApiErrors, getApiErrors } from "../lib/api-error-log";
import { recordClientEvent } from "../lib/client-debug-log";
import {
  sanitizeDebugText,
  sanitizeRequestPath,
  sanitizeVideoContext,
} from "../lib/debug-sanitize";
import { clearCrashLogs, getCrashLogs } from "../lib/error-capture";
import type {
  BugReportCategory,
  BugReportContext,
  CreateBugReportRequest,
  PlayerStateContext,
} from "../types/bug-report";

type SubmitParams = {
  category: BugReportCategory;
  description: string;
  videoUrl?: string | null;
  playerState?: PlayerStateContext | null;
};

function buildContext(
  route: string,
  videoUrl: string | null,
  playerState: PlayerStateContext | null,
): BugReportContext {
  return {
    videoUrl: sanitizeVideoContext(videoUrl),
    route: sanitizeRequestPath(route),
    timestamp: Date.now(),
    userAgent: sanitizeDebugText(navigator.userAgent),
    browserLanguage: navigator.language,
    playerState,
    crashLogs: getCrashLogs(),
    apiErrors: getApiErrors(),
  };
}

export function useBugReport() {
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: (params: SubmitParams) => {
      const context = buildContext(
        location.pathname,
        params.videoUrl ?? null,
        params.playerState ?? null,
      );
      const request: CreateBugReportRequest = {
        category: params.category,
        description: params.description,
        context,
      };
      recordClientEvent("bug.report_submit_attempt", {
        route: context.route,
        category: params.category,
      });
      return submitBugReport(request);
    },
    onSuccess: () => {
      clearCrashLogs();
      clearApiErrors();
    },
  });

  return mutation;
}
