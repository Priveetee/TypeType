import { toApiUrl } from "../lib/env";
import { getOpenMojiUrl, pickOpenMojiCode } from "../lib/openmoji";
import type { AuthUser } from "../types/auth";

type AdminUserAvatarProps = {
  user: AuthUser;
  className: string;
};

export function AdminUserAvatar({ user, className }: AdminUserAvatarProps) {
  const seed = `${user.id}:${user.email}`;
  const avatarUrl =
    user.avatarType === "emoji" && typeof user.avatarCode === "string" && user.avatarCode.length > 0
      ? getOpenMojiUrl(user.avatarCode)
      : user.avatarUrl
        ? toApiUrl(user.avatarUrl)
        : getOpenMojiUrl(pickOpenMojiCode(seed));

  return (
    <div className={`${className} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800`}>
      <img
        src={avatarUrl}
        alt={user.name || user.email}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
