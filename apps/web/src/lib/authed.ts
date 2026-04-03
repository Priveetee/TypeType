import { useAuthStore } from "../stores/auth-store";
import { ApiError } from "./api";
import { recordApiError } from "./api-error-log";
import { refreshSession } from "./auth-session";
import { extractRequestId, recordClientEvent } from "./client-debug-log";
import { sanitizeDebugText, sanitizeRequestPath } from "./debug-sanitize";

function withBearer(init: RequestInit | undefined, token: string): RequestInit {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

export async function authed(url: string, init?: RequestInit): Promise<Response> {
  const token = useAuthStore.getState().token;
  const method = init?.method ?? "GET";
  const path = sanitizeRequestPath(url);
  if (!token) {
    recordApiError({
      endpoint: url,
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Authentication required",
    });
    recordClientEvent("auth.missing_token", { method, path });
    throw new ApiError("Authentication required", 401);
  }
  let res: Response;
  try {
    res = await fetch(url, withBearer(init, token));
  } catch (error) {
    const message = error instanceof Error ? error.message : "network_error";
    recordApiError({
      endpoint: url,
      status: 520,
      code: "NETWORK_ERROR",
      message,
    });
    recordClientEvent("auth.network_error", {
      method,
      path,
      message: sanitizeDebugText(message),
    });
    throw error;
  }
  if (res.status === 401) {
    recordClientEvent("auth.unauthorized_retry", { method, path });
    try {
      const retryToken = await refreshSession();
      const retryRes = await fetch(url, withBearer(init, retryToken));
      if (!retryRes.ok) {
        recordApiError({
          endpoint: url,
          status: retryRes.status,
          code: "AUTH_RETRY_ERROR",
          message: "Retry request failed",
          requestId: extractRequestId(retryRes.headers),
        });
        recordClientEvent("auth.retry_error", {
          method,
          path,
          status: retryRes.status,
          requestId: extractRequestId(retryRes.headers),
        });
      }
      return retryRes;
    } catch {
      useAuthStore.getState().setSignedOut();
      recordApiError({
        endpoint: url,
        status: 401,
        code: "SESSION_EXPIRED",
        message: "Session expired",
      });
      recordClientEvent("auth.session_expired", { method, path });
      throw new ApiError("Session expired", 401);
    }
  }
  if (!res.ok) {
    recordApiError({
      endpoint: url,
      status: res.status,
      code: "AUTH_RESPONSE_ERROR",
      message: "Authed request failed",
      requestId: extractRequestId(res.headers),
    });
    recordClientEvent("auth.response_error", {
      method,
      path,
      status: res.status,
      requestId: extractRequestId(res.headers),
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
