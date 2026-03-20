import { ApiError } from "./api";
import { authed } from "./authed";
import { API_BASE as BASE } from "./env";

type SetEmojiAvatarPayload = {
  code: string;
};

export async function setEmojiAvatar(payload: SetEmojiAvatarPayload): Promise<void> {
  const res = await authed(`${BASE}/profile/avatar/emoji`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status !== 204) throw new ApiError("Failed to set emoji avatar", res.status);
}

export async function clearAvatar(): Promise<void> {
  const res = await authed(`${BASE}/profile/avatar`, { method: "DELETE" });
  if (res.status !== 204) throw new ApiError("Failed to clear avatar", res.status);
}
