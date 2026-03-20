import type {
  BulletCommentsPageResponse,
  ChannelResponse,
  CommentsPageResponse,
  SearchPageResponse,
  StreamResponse,
  VideoItem,
} from "../types/api";

import { API_BASE as BASE } from "./env";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ErrorLikeBody = {
  error?: string;
  message?: string;
};

async function readBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => null);
  }
  return res.text().catch(() => "");
}

function toErrorMessage(status: number, statusText: string, body: unknown): string {
  if (typeof body === "string") {
    const trimmed = body.trim();
    if (trimmed.length > 0) return trimmed;
  }
  if (body && typeof body === "object") {
    const candidate = body as ErrorLikeBody;
    if (typeof candidate.error === "string" && candidate.error.length > 0) return candidate.error;
    if (typeof candidate.message === "string" && candidate.message.length > 0)
      return candidate.message;
  }
  if (status === 429) return "Too many requests. Try again in a few seconds.";
  if (statusText.length > 0) return statusText;
  return "Request failed";
}

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await readBody(res);
  if (!res.ok) throw new ApiError(toErrorMessage(res.status, res.statusText, body), res.status);
  return body as T;
}

export function fetchTrending(service: number): Promise<VideoItem[]> {
  return request(`${BASE}/trending?service=${service}`);
}

export function fetchStream(url: string): Promise<StreamResponse> {
  return request(`${BASE}/streams?url=${encodeURIComponent(url)}`);
}

export function fetchSearch(
  q: string,
  service: number,
  nextpage?: string,
): Promise<SearchPageResponse> {
  const params = new URLSearchParams({ q, service: String(service) });
  if (nextpage) params.set("nextpage", nextpage);
  return request(`${BASE}/search?${params}`);
}

export function fetchComments(url: string, nextpage?: string): Promise<CommentsPageResponse> {
  const params = new URLSearchParams({ url });
  if (nextpage) params.set("nextpage", nextpage);
  return request(`${BASE}/comments?${params}`);
}

export function fetchCommentReplies(
  url: string,
  repliesPage: string,
): Promise<CommentsPageResponse> {
  const params = new URLSearchParams({ url, repliesPage });
  return request(`${BASE}/comments/replies?${params}`);
}

export function fetchChannel(url: string, nextpage?: string): Promise<ChannelResponse> {
  const params = new URLSearchParams({ url });
  if (nextpage) params.set("nextpage", nextpage);
  return request(`${BASE}/channel?${params}`);
}

export function fetchSuggestions(query: string, service: number): Promise<string[]> {
  const params = new URLSearchParams({ query, service: String(service) });
  return request(`${BASE}/suggestions?${params}`);
}

export function fetchBulletComments(url: string): Promise<BulletCommentsPageResponse> {
  return request(`${BASE}/bullet-comments?url=${encodeURIComponent(url)}`);
}
