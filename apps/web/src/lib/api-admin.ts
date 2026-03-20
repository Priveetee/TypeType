import type { AuthRole, AuthUser, PasswordResetToken } from "../types/auth";
import { ApiError } from "./api";
import { authed, authedJson } from "./authed";
import { API_BASE as BASE } from "./env";

function normalizeAdminUser(user: AuthUser): AuthUser {
  return {
    ...user,
    avatarUrl: user.avatarUrl ?? null,
    avatarType: user.avatarType ?? null,
    avatarCode: user.avatarCode ?? null,
  };
}

export function fetchAdminUsers(): Promise<AuthUser[]> {
  return authedJson<AuthUser[]>(`${BASE}/admin/users`).then((users) =>
    users.map(normalizeAdminUser),
  );
}

export async function updateUserRole(id: string, role: AuthRole): Promise<void> {
  const res = await authed(`${BASE}/admin/users/${encodeURIComponent(id)}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (res.status !== 204) throw new ApiError("Failed to update role", res.status);
}

export async function suspendUser(id: string): Promise<void> {
  const res = await authed(`${BASE}/admin/users/${encodeURIComponent(id)}/suspend`, {
    method: "POST",
  });
  if (res.status !== 204) throw new ApiError("Failed to suspend user", res.status);
}

export async function unsuspendUser(id: string): Promise<void> {
  const res = await authed(`${BASE}/admin/users/${encodeURIComponent(id)}/suspend`, {
    method: "DELETE",
  });
  if (res.status !== 204) throw new ApiError("Failed to unsuspend user", res.status);
}

export async function createPasswordResetToken(id: string): Promise<PasswordResetToken> {
  const res = await authed(`${BASE}/admin/users/${encodeURIComponent(id)}/reset-token`, {
    method: "POST",
  });
  const body = (await res.json().catch(() => ({ resetToken: "" }))) as Partial<PasswordResetToken>;
  if (res.status !== 201 || typeof body.resetToken !== "string" || body.resetToken.length === 0) {
    throw new ApiError("Failed to create reset token", res.status);
  }
  return { resetToken: body.resetToken };
}
