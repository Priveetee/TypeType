import { formatTimestamp } from "../lib/bug-report-utils";
import type { BugReportDetail } from "../types/bug-report";

type Props = {
  report: BugReportDetail;
};

export function AdminBugReportDiagnosticsDetails({ report }: Props) {
  const crashLogs = report.context.crashLogs;
  const apiErrors = report.context.apiErrors;

  return (
    <>
      {report.context.playerState && (
        <details className="border-t border-zinc-800 pt-2">
          <summary className="cursor-pointer text-xs font-medium text-zinc-200">
            Player state
          </summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11px] text-zinc-300">
            {JSON.stringify(report.context.playerState, null, 2)}
          </pre>
        </details>
      )}

      {apiErrors.length > 0 && (
        <details className="border-t border-zinc-800 pt-2">
          <summary className="cursor-pointer text-xs font-medium text-zinc-200">API errors</summary>
          <div className="mt-2 space-y-2">
            {apiErrors.slice(0, 8).map((error) => (
              <div
                key={`${error.endpoint}-${error.timestamp}-${error.requestId ?? "na"}-${error.code ?? "na"}-${error.message}`}
                className="border-l border-zinc-700 pl-2"
              >
                <p className="text-[11px] text-zinc-300">{error.endpoint}</p>
                <p className="text-[11px] text-zinc-500">
                  {error.status} · {error.code ?? "unknown"} · {formatTimestamp(error.timestamp)}
                </p>
                <p className="text-[11px] text-zinc-400">{error.message}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {crashLogs.length > 0 && (
        <details className="border-t border-zinc-800 pt-2">
          <summary className="cursor-pointer text-xs font-medium text-zinc-200">Crash logs</summary>
          <div className="mt-2 space-y-2">
            {crashLogs.slice(0, 5).map((entry) => (
              <div
                key={`${entry.timestamp}-${entry.message}-${entry.stack ?? ""}`}
                className="border-l border-zinc-700 pl-2"
              >
                <p className="text-[11px] text-zinc-300">{entry.message}</p>
                <p className="text-[11px] text-zinc-500">{formatTimestamp(entry.timestamp)}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </>
  );
}
