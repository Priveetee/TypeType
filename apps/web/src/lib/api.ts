import type {
  ChannelResponse,
  CommentsPageResponse,
  SearchPageResponse,
  StreamResponse,
  VideoItem,
} from "../types/api";

const BASE = import.meta.env.VITE_API_URL;

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error);
  return body;
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

export function fetchChannel(url: string, nextpage?: string): Promise<ChannelResponse> {
  const params = new URLSearchParams({ url });
  if (nextpage) params.set("nextpage", nextpage);
  return request(`${BASE}/channel?${params}`);
}
