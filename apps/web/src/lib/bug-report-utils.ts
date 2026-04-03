import type { BugReportCategory, BugReportStatus } from "../types/bug-report";

export const STATUS_OPTIONS: { value: BugReportStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "triaged", label: "Triaged" },
  { value: "in_progress", label: "In Progress" },
  { value: "fixed", label: "Fixed" },
  { value: "closed", label: "Closed" },
];

export const CATEGORY_OPTIONS: { value: BugReportCategory; label: string }[] = [
  { value: "player", label: "Player" },
  { value: "audio_language", label: "Audio Language" },
  { value: "subtitles", label: "Subtitles" },
  { value: "ui", label: "Interface" },
  { value: "functionality", label: "Functionality" },
];

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function statusColor(status: BugReportStatus): string {
  switch (status) {
    case "new":
      return "bg-blue-600";
    case "triaged":
      return "bg-yellow-600";
    case "in_progress":
      return "bg-orange-600";
    case "fixed":
      return "bg-green-600";
    case "closed":
      return "bg-zinc-600";
  }
}
