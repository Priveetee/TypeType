import type { AuthUser } from "../types/auth";
import { AdminUserAvatar } from "./admin-user-avatar";

type AdminUserRowProps = {
  user: AuthUser;
  selected: boolean;
  createdAtLabel: string;
  onSelect: (id: string) => void;
};

function roleClass(role: AuthUser["role"]): string {
  if (role === "admin") return "border-sky-800/70 bg-sky-950/40 text-sky-200";
  if (role === "moderator") return "border-amber-800/70 bg-amber-950/40 text-amber-200";
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export function AdminUserRow({ user, selected, createdAtLabel, onSelect }: AdminUserRowProps) {
  const displayName = user.name.trim().length > 0 ? user.name : user.email;

  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      className={`w-full rounded-2xl border bg-zinc-900 p-3 text-left transition-colors ${
        selected
          ? "border-zinc-500 ring-1 ring-zinc-500/60"
          : "border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <AdminUserAvatar user={user} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">{displayName}</p>
          <p className="truncate text-xs text-zinc-400">{user.email}</p>
        </div>
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide ${roleClass(user.role)}`}
        >
          {user.role}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-zinc-500">
          {createdAtLabel}
        </span>
        {user.suspended && (
          <span className="rounded-md border border-red-900 bg-red-950/40 px-2 py-0.5 text-red-300">
            suspended
          </span>
        )}
      </div>
    </button>
  );
}
