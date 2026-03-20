import { ApiError } from "./api";
import { authed } from "./authed";
import { API_BASE as BASE } from "./env";

export type ProfilePatch = {
  publicUsername: string | null;
  bio: string | null;
};

type ErrorPayload = {
  error?: string;
};

function readErrorCode(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "PROFILE_UPDATE_FAILED";
  const candidate = payload as ErrorPayload;
  return typeof candidate.error === "string" ? candidate.error : "PROFILE_UPDATE_FAILED";
}

export async function updateProfile(payload: ProfilePatch): Promise<void> {
  const res = await authed(`${BASE}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 204) return;
  const body = await res.json().catch(() => ({}));
  throw new ApiError(readErrorCode(body), res.status);
}
