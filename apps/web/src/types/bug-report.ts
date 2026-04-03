export type BugReportCategory = "player" | "audio_language" | "subtitles" | "ui" | "functionality";

export type BugReportStatus = "new" | "triaged" | "in_progress" | "fixed" | "closed";

export type CrashLogEntry = {
  message: string;
  stack: string | null;
  timestamp: number;
};

export type BugApiErrorItem = {
  endpoint: string;
  status: number;
  code: string | null;
  message: string;
  requestId: string | null;
  timestamp: number;
};

export type PlayerStateContext = {
  currentTime?: number;
  quality?: string;
  audioTrack?: string;
  subtitles?: string;
  paused?: boolean;
  muted?: boolean;
  volume?: number;
};

export type BugReportContext = {
  videoUrl: string | null;
  route: string;
  timestamp: number;
  userAgent: string;
  browserLanguage: string;
  playerState: PlayerStateContext | null;
  crashLogs: CrashLogEntry[];
  apiErrors: BugApiErrorItem[];
};

export type CreateBugReportRequest = {
  category: BugReportCategory;
  description: string;
  context: BugReportContext;
};

export type CreateBugReportResponse = {
  id: string;
  status: BugReportStatus;
  createdAt: number;
};

export type BugReportListItem = {
  id: string;
  category: BugReportCategory;
  description: string;
  status: BugReportStatus;
  userId: string;
  userEmail: string;
  githubIssueUrl: string | null;
  createdAt: number;
  updatedAt: number;
};

export type BugReportDetail = BugReportListItem & {
  context: BugReportContext;
};

export type BugReportListResponse = {
  items: BugReportListItem[];
  page: number;
  limit: number;
  total: number;
};

export type UpdateStatusResponse = {
  id: string;
  status: BugReportStatus;
  updatedAt: number;
};

export type CreateGitHubIssueResponse = {
  id: string;
  githubIssueUrl: string;
  updatedAt: number;
};
