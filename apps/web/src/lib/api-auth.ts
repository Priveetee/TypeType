import type { AuthMe, AuthResponse } from "../types/auth";
import { ApiError } from "./api";
import { recordApiError } from "./api-error-log";
import { extractRequestId, recordClientEvent } from "./client-debug-log";
import { sanitizeDebugText, sanitizeRequestPath } from "./debug-sanitize";
import { API_BASE as BASE } from "./env";

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  name: string;
};

async function parseAuthResponse(res: Response): Promise<AuthResponse> {
  const body = (await res.json().catch(() => ({ token: "" }))) as Partial<AuthResponse>;
  if (!res.ok || typeof body.token !== "string" || body.token.length === 0) {
    recordApiError({
      endpoint: "/auth",
      status: res.status,
      code: "AUTH_API_ERROR",
      message: "Authentication failed",
      requestId: extractRequestId(res.headers),
    });
    recordClientEvent("auth.api_error", {
      status: res.status,
      requestId: extractRequestId(res.headers),
      message: "Authentication failed",
    });
    throw new ApiError("Authentication failed", res.status);
  }
  return { token: body.token };
}

async function authedJson<T>(url: string, token: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network_error";
    recordApiError({
      endpoint: url,
      status: 520,
      code: "NETWORK_ERROR",
      message,
    });
    recordClientEvent("auth.api_network_error", {
      method: "GET",
      path: sanitizeRequestPath(url),
      message: sanitizeDebugText(message),
    });
    throw error;
  }
  const body = await res.json().catch(() => ({ error: "Request failed" }));
  if (!res.ok) {
    const requestId = extractRequestId(res.headers);
    const message = (body as { error?: string }).error ?? "Request failed";
    recordApiError({
      endpoint: url,
      status: res.status,
      code: "AUTH_HTTP_ERROR",
      message,
      requestId,
    });
    recordClientEvent("auth.api_error", {
      method: "GET",
      path: sanitizeRequestPath(url),
      status: res.status,
      requestId,
      message: sanitizeDebugText(message),
    });
    throw new ApiError(message, res.status);
  }
  return body as T;
}

function normalizeAuthMe(me: AuthMe): AuthMe {
  return {
    id: me.id,
    role: me.role,
    publicUsername: me.publicUsername ?? null,
    bio: me.bio ?? null,
    avatarUrl: me.avatarUrl ?? null,
    avatarType: me.avatarType ?? null,
    avatarCode: me.avatarCode ?? null,
  };
}

export async function registerAuth(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res);
}

export async function loginAuth(payload: AuthPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res);
}

export async function refreshAuth(token: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return parseAuthResponse(res);
}

export async function resetPassword(payload: {
  resetToken: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok && res.status !== 204) {
    const requestId = extractRequestId(res.headers);
    recordApiError({
      endpoint: `${BASE}/auth/reset-password`,
      status: res.status,
      code: "RESET_PASSWORD_ERROR",
      message: "Invalid or expired reset token",
      requestId,
    });
    recordClientEvent("auth.reset_password_error", {
      method: "POST",
      path: sanitizeRequestPath(`${BASE}/auth/reset-password`),
      status: res.status,
      requestId,
      message: "Invalid or expired reset token",
    });
    throw new ApiError("Invalid or expired reset token", res.status);
  }
}

export function fetchMe(token: string): Promise<AuthMe> {
  return authedJson<AuthMe>(`${BASE}/auth/me`, token).then(normalizeAuthMe);
}
