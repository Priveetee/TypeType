export function formatRestoreTimeRange(min: number | null, max: number | null): string {
  if (min === null || max === null) return "No watch date range returned";
  const from = new Date(min).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const to = new Date(max).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${from} -> ${to}`;
}
