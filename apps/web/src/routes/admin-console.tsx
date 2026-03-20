import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminUserDetailPanel } from "../components/admin-user-detail-panel";
import { AdminUserGrid } from "../components/admin-user-grid";
import { AdminUserToolbar } from "../components/admin-user-toolbar";
import { Toast } from "../components/toast";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useAuth } from "../hooks/use-auth";
import { type AdminFilter, matchesAdminFilter } from "../lib/admin-console";
import { goto } from "../lib/route-redirect";

function AdminConsolePage() {
  const { isAdmin } = useAuth();
  const { query, role, suspend, resetToken } = useAdminUsers(isAdmin);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AdminFilter>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const users = query.data ?? [];
  const searchTerm = search.trim().toLowerCase();
  const busy = role.isPending || suspend.isPending || resetToken.isPending;
  const filtered = useMemo(
    () =>
      users
        .filter((user) => {
          if (!matchesAdminFilter(user, filter)) return false;
          if (!searchTerm) return true;
          const haystack = `${user.name} ${user.email} ${user.id}`.toLowerCase();
          return haystack.includes(searchTerm);
        })
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))),
    [users, filter, searchTerm],
  );
  const selectedUser = filtered.find((user) => user.id === selectedUserId) ?? null;

  if (!isAdmin) {
    goto("/");
    return null;
  }

  return (
    <div className="flex flex-col gap-5 [animation:page-fade-in_0.2s_ease-out]">
      <AdminUserToolbar
        search={search}
        filter={filter}
        onSearchChange={(value) => setSearch(value)}
        onFilterChange={(value) => setFilter(value)}
      />

      {query.isPending && (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-center text-sm text-zinc-400">
          Loading users...
        </section>
      )}

      {query.isError && (
        <section className="rounded-lg border border-red-900 bg-red-950/30 p-6 text-center text-sm text-red-300">
          Unable to load users right now.
        </section>
      )}

      {!query.isPending && !query.isError && filtered.length === 0 && (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 text-center text-sm text-zinc-400">
          No user matches this view.
        </section>
      )}

      {!query.isPending && !query.isError && filtered.length > 0 && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <AdminUserGrid
            users={filtered}
            selectedUserId={selectedUserId}
            onSelectUser={(id) => setSelectedUserId(id)}
          />
          {selectedUser ? (
            <AdminUserDetailPanel
              user={selectedUser}
              busy={busy}
              onRole={(id, nextRole) => {
                role.mutate(
                  { id, role: nextRole },
                  {
                    onSuccess: () => setToast(`Role set to ${nextRole}`),
                    onError: () => setToast("Unable to update role"),
                  },
                );
              }}
              onSuspend={(id, suspendedFlag) => {
                suspend.mutate(
                  { id, suspended: suspendedFlag },
                  {
                    onSuccess: () =>
                      setToast(suspendedFlag ? "User unsuspended" : "User suspended"),
                    onError: () => setToast("Unable to update suspension"),
                  },
                );
              }}
              onReset={(id, email) => {
                resetToken.mutate(id, {
                  onSuccess: (result) => setToast(`Reset token for ${email}: ${result.resetToken}`),
                  onError: () => setToast("Unable to generate reset token"),
                });
              }}
            />
          ) : (
            <div className="hidden lg:block" />
          )}
        </section>
      )}
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/admin-console")({ component: AdminConsolePage });
