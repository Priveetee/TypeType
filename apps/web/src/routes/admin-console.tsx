import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminUserDetailPanel } from "../components/admin-user-detail-panel";
import { AdminUserGrid } from "../components/admin-user-grid";
import { AdminUserToolbar } from "../components/admin-user-toolbar";
import { AdminUsersPagination } from "../components/admin-users-pagination";
import { ResetTokenModal } from "../components/reset-token-modal";
import { Toast } from "../components/toast";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useAuth } from "../hooks/use-auth";
import { type AdminFilter, matchesAdminFilter } from "../lib/admin-console";
import { goto } from "../lib/route-redirect";

const PAGE_SIZE = 50;

function AdminConsolePage() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const { query, role, suspend, resetToken } = useAdminUsers(isAdmin, page, PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AdminFilter>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [resetTokenData, setResetTokenData] = useState<{ email: string; token: string } | null>(
    null,
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const users = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = query.data?.page ?? page;
  const pageStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = total === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, total);
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

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedUserId(null);
      return;
    }
    const found = selectedUserId && filtered.some((user) => user.id === selectedUserId);
    if (found) return;
    setSelectedUserId(filtered[0].id);
  }, [selectedUserId, filtered]);

  if (!isAdmin) {
    goto("/");
    return null;
  }

  return (
    <div className="flex flex-col gap-5 [animation:page-fade-in_0.2s_ease-out]">
      <AdminUserToolbar
        search={search}
        filter={filter}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
      />
      <AdminUsersPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        pageStart={pageStart}
        pageEnd={pageEnd}
        pending={query.isPending}
        onPrev={() => setPage((value) => Math.max(1, value - 1))}
        onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
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
                  { id, suspended: !suspendedFlag },
                  {
                    onSuccess: () =>
                      setToast(!suspendedFlag ? "User suspended" : "User unsuspended"),
                    onError: () => setToast("Unable to update suspension"),
                  },
                );
              }}
              onReset={(id, email) => {
                resetToken.mutate(id, {
                  onSuccess: (result) => setResetTokenData({ email, token: result.resetToken }),
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
      {resetTokenData && (
        <ResetTokenModal
          email={resetTokenData.email}
          token={resetTokenData.token}
          onClose={() => setResetTokenData(null)}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/admin-console")({ component: AdminConsolePage });
