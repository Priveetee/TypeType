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
  return "border-border-strong bg-surface text-fg-muted";
}

export function AdminUserRow({ user, selected, createdAtLabel, onSelect }: AdminUserRowProps) {
  const displayName = user.name.trim().length > 0 ? user.name : user.email;

  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      className={`w-full rounded-2xl border bg-surface p-3 text-left transition-colors ${
        selected
          ? "border-border-strong ring-1 ring-border-strong/60"
          : "border-border hover:border-border-strong"
      }`}
    >
      <div className="flex items-center gap-3">
        <AdminUserAvatar user={user} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">{displayName}</p>
          <p className="truncate text-xs text-fg-muted">{user.email}</p>
        </div>
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide ${roleClass(user.role)}`}
        >
          {user.role}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-md border border-border-strong px-2 py-0.5 text-fg-soft">
          {createdAtLabel}
        </span>
        {user.suspended && (
          <span className="rounded-md border border-danger bg-danger/40 px-2 py-0.5 text-danger-strong">
            suspended
          </span>
        )}
      </div>
    </button>
  );
}
