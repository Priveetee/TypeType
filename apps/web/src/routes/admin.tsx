import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toast } from "../components/toast";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useAuth } from "../hooks/use-auth";
import { goto } from "../lib/route-redirect";
import type { AuthRole, AuthUser } from "../types/auth";

type RoleSelectProps = {
  value: AuthRole;
  onChange: (role: AuthRole) => void;
};

function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AuthRole)}
      className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-200"
    >
      <option value="user">user</option>
      <option value="moderator">moderator</option>
      <option value="admin">admin</option>
    </select>
  );
}

function UserRow({
  user,
  onRole,
  onSuspend,
  onReset,
}: {
  user: AuthUser;
  onRole: (id: string, role: AuthRole) => void;
  onSuspend: (id: string, suspended: boolean) => void;
  onReset: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-[1.3fr_1fr_110px_120px_130px] items-center gap-3 px-4 py-3 border-b border-zinc-800 text-xs">
      <div className="min-w-0">
        <p className="text-zinc-100 truncate">{user.name || user.email}</p>
        <p className="text-zinc-500 truncate">{user.email}</p>
      </div>
      <p className="text-zinc-400 truncate">{user.id}</p>
      <RoleSelect value={user.role} onChange={(role) => onRole(user.id, role)} />
      <button
        type="button"
        onClick={() => onSuspend(user.id, user.suspended)}
        className="h-8 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
      >
        {user.suspended ? "Unsuspend" : "Suspend"}
      </button>
      <button
        type="button"
        onClick={() => onReset(user.id)}
        className="h-8 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
      >
        Reset token
      </button>
    </div>
  );
}

function AdminPage() {
  const { isAdmin } = useAuth();
  const { query, role, suspend, resetToken } = useAdminUsers(isAdmin);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!isAdmin) {
    goto("/");
    return null;
  }

  const users = query.data ?? [];

  return (
    <div className="flex flex-col gap-4 [animation:page-fade-in_0.2s_ease-out]">
      <h1 className="text-lg font-semibold text-zinc-100">Admin panel</h1>
      <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900">
        <div className="grid grid-cols-[1.3fr_1fr_110px_120px_130px] gap-3 px-4 py-2 text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
          <span>User</span>
          <span>Id</span>
          <span>Role</span>
          <span>Suspension</span>
          <span>Password</span>
        </div>
        {query.isPending && <p className="px-4 py-4 text-sm text-zinc-400">Loading users...</p>}
        {!query.isPending && users.length === 0 && (
          <p className="px-4 py-4 text-sm text-zinc-400">No users found.</p>
        )}
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onRole={(id, nextRole) => role.mutate({ id, role: nextRole })}
            onSuspend={(id, suspendedFlag) => suspend.mutate({ id, suspended: suspendedFlag })}
            onReset={(id) => {
              resetToken.mutate(id, {
                onSuccess: (result) => setToast(`Reset token: ${result.resetToken}`),
              });
            }}
          />
        ))}
      </div>
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/admin")({ component: AdminPage });
