type Props = {
  tokenFetchMs: number | null;
  ytdlpMs: number | null;
  uploadMs: number | null;
  totalMs: number | null;
};

type MetricRow = {
  key: string;
  label: string;
  value: number;
};

function formatMs(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10_000 ? 1 : 2)}s`;
  return `${Math.round(value)}ms`;
}

function collectMetrics({ tokenFetchMs, ytdlpMs, uploadMs, totalMs }: Props): MetricRow[] {
  const rows: MetricRow[] = [];
  if (typeof tokenFetchMs === "number")
    rows.push({ key: "token", label: "Token", value: tokenFetchMs });
  if (typeof ytdlpMs === "number") rows.push({ key: "fetch", label: "Fetch", value: ytdlpMs });
  if (typeof uploadMs === "number") rows.push({ key: "upload", label: "Upload", value: uploadMs });
  if (typeof totalMs === "number") rows.push({ key: "total", label: "Total", value: totalMs });
  return rows;
}

export function DownloadPhaseMetrics({ tokenFetchMs, ytdlpMs, uploadMs, totalMs }: Props) {
  const rows = collectMetrics({ tokenFetchMs, ytdlpMs, uploadMs, totalMs });
  if (rows.length === 0) return null;
  return (
    <div className="mt-2 grid grid-cols-2 gap-1.5">
      {rows.map((row) => (
        <div key={row.key} className="rounded-md border border-border bg-app/70 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-fg-soft">{row.label}</p>
          <p className="text-xs text-fg">{formatMs(row.value)}</p>
        </div>
      ))}
    </div>
  );
}
