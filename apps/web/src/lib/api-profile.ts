import { ApiError } from "./api";
import { authed } from "./authed";
import { API_BASE as BASE } from "./env";

export type ProfilePatch = {
  publicUsername: string | null;
  bio: string | null;
};

export async function updateProfile(payload: ProfilePatch): Promise<void> {
  const res = await authed(`${BASE}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status !== 204) throw new ApiError("Failed to update profile", res.status);
}
