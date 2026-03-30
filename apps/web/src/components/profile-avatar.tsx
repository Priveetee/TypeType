import { toApiUrl } from "../lib/env";
import { getOpenMojiUrl, pickOpenMojiCode } from "../lib/openmoji";
import type { AuthMe } from "../types/auth";

type ProfileAvatarProps = {
  me: AuthMe;
  className: string;
  plain?: boolean;
};

export function ProfileAvatar({ me, className, plain = false }: ProfileAvatarProps) {
  const seed = `${me.id}:${me.publicUsername ?? "profile"}`;
  const avatarUrl =
    me.avatarType === "emoji" && typeof me.avatarCode === "string" && me.avatarCode.length > 0
      ? getOpenMojiUrl(me.avatarCode)
      : me.avatarUrl
        ? toApiUrl(me.avatarUrl)
        : getOpenMojiUrl(pickOpenMojiCode(seed));

  return (
    <div
      className={
        plain
          ? `${className} overflow-hidden rounded-full`
          : `${className} overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800`
      }
    >
      <img
        src={avatarUrl}
        alt={me.publicUsername ?? me.id}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
