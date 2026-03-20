import type { AuthMe, AuthResponse } from "../types/auth";
import { ApiError } from "./api";
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
    throw new ApiError("Authentication failed", res.status);
  }
  return { token: body.token };
}

async function authedJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({ error: "Request failed" }));
  if (!res.ok)
    throw new ApiError((body as { error?: string }).error ?? "Request failed", res.status);
  return body as T;
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
    throw new ApiError("Invalid or expired reset token", res.status);
  }
}

export function fetchMe(token: string): Promise<AuthMe> {
  return authedJson<AuthMe>(`${BASE}/auth/me`, token);
}
