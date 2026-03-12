import { ApiError } from "./api";
import { getToken, invalidateToken } from "./token";

export async function authed(url: string, init?: RequestInit): Promise<Response> {
  const token = await getToken();
  const res = await fetch(url, {
    ...init,
    headers: { "X-Instance-Token": token, ...(init?.headers ?? {}) },
  });
  if (res.status === 401) {
    invalidateToken();
    const retryToken = await getToken();
    return fetch(url, {
      ...init,
      headers: { "X-Instance-Token": retryToken, ...(init?.headers ?? {}) },
    });
  }
  return res;
}

export async function authedJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await authed(url, init);
  const body = await res.json();
  if (!res.ok) throw new ApiError((body as { error: string }).error, res.status);
  return body as T;
}
