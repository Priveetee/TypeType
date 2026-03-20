import { getOpenMojiUrl, pickOpenMojiCode } from "../lib/openmoji";
import type { AuthUser } from "../types/auth";

type AdminUserAvatarProps = {
  user: AuthUser;
  className: string;
};

export function AdminUserAvatar({ user, className }: AdminUserAvatarProps) {
  const seed = `${user.id}:${user.email}`;
  const emojiUrl = getOpenMojiUrl(pickOpenMojiCode(seed));

  return (
    <div className={`${className} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800`}>
      <img
        src={emojiUrl}
        alt={user.name || user.email}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
