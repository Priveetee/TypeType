import { useState } from "react";
import type { AuthRole, AuthUser } from "../types/auth";
import { AdminUserAvatar } from "./admin-user-avatar";

type AdminUserDetailPanelProps = {
  user: AuthUser;
  busy: boolean;
  onRole: (id: string, role: AuthRole) => void;
  onSuspend: (id: string, suspended: boolean) => void;
  onReset: (id: string, email: string) => void;
};

const ROLE_OPTIONS: AuthRole[] = ["user", "moderator", "admin"];

function roleClass(active: boolean): string {
  if (active) return "border-zinc-100 bg-zinc-100 text-zinc-900";
  return "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500";
}

export function AdminUserDetailPanel({
  user,
  busy,
  onRole,
  onSuspend,
  onReset,
}: AdminUserDetailPanelProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const suspendClass = user.suspended
    ? "border-emerald-800/60 bg-emerald-950/30 text-emerald-200 hover:border-emerald-700"
    : "border-red-900/60 bg-red-950/30 text-red-200 hover:border-red-700";

  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-16 h-fit [animation:admin-panel-slide-in_0.22s_cubic-bezier(0.22,1,0.36,1)]">
      <div className="flex items-center gap-3">
        <AdminUserAvatar user={user} className="h-11 w-11" />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-zinc-100">
            {user.name || user.email}
          </p>
          <p className="truncate text-xs text-zinc-400">{user.email}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500 break-all">{user.id}</p>

      <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
        {ROLE_OPTIONS.map((role) => (
          <button
            key={`${user.id}-${role}`}
            type="button"
            disabled={busy || user.role === role}
            onClick={() => onRole(user.id, role)}
            className={`h-8 rounded-md border text-[11px] uppercase tracking-wide transition-colors disabled:opacity-50 ${roleClass(
              user.role === role,
            )}`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="mt-3 relative">
        <button
          type="button"
          aria-expanded={actionsOpen}
          onClick={() => setActionsOpen((open) => !open)}
          className="ml-auto block h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-200 transition-all duration-150 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800"
        >
          Actions
        </button>

        {actionsOpen && (
          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl [animation:admin-actions-pop_0.18s_cubic-bezier(0.22,1,0.36,1)]">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                onSuspend(user.id, user.suspended);
                setActionsOpen(false);
              }}
              className={`mb-1 h-8 w-full rounded-md border px-2.5 text-left text-xs font-medium transition-colors disabled:opacity-50 ${suspendClass}`}
            >
              {user.suspended ? "Unsuspend" : "Suspend"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                onReset(user.id, user.email);
                setActionsOpen(false);
              }}
              className="h-8 w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 text-left text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-50"
            >
              Reset token
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
