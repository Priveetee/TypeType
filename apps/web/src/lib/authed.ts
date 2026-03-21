import { useAuthStore } from "../stores/auth-store";
import { ApiError } from "./api";
import { refreshSession } from "./auth-session";

function withBearer(init: RequestInit | undefined, token: string): RequestInit {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

export async function authed(url: string, init?: RequestInit): Promise<Response> {
  const token = useAuthStore.getState().token;
  if (!token) throw new ApiError("Authentication required", 401);
  const res = await fetch(url, withBearer(init, token));
  if (res.status === 401) {
    try {
      const retryToken = await refreshSession();
      return fetch(url, withBearer(init, retryToken));
    } catch {
      useAuthStore.getState().setSignedOut();
      throw new ApiError("Session expired", 401);
    }
  }
  return res;
}

export async function authedJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await authed(url, init);
  const body = await res.json();
  if (!res.ok) throw new ApiError((body as { error: string }).error, res.status);
  return body as T;
}
