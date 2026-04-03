import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminBugReportsSection } from "../components/admin-bug-reports-section";
import { AdminSettingsSection } from "../components/admin-settings-section";
import { AdminUsersSection } from "../components/admin-users-section";
import { Toast } from "../components/toast";
import { useAuth } from "../hooks/use-auth";
import { goto } from "../lib/route-redirect";

function AdminConsolePage() {
  const { isAdmin, isModerator, me } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const canAccessAdmin = isAdmin || isModerator;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!canAccessAdmin) {
    goto("/");
    return null;
  }

  return (
    <div className="flex flex-col gap-5 [animation:page-fade-in_0.2s_ease-out]">
      {isAdmin && <AdminSettingsSection enabled={isAdmin} onToast={setToast} />}
      {isAdmin && (
        <AdminUsersSection enabled={isAdmin} currentUserId={me?.id ?? null} onToast={setToast} />
      )}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-zinc-100">Bug Reports</h2>
        <AdminBugReportsSection enabled={canAccessAdmin} isAdmin={isAdmin} onToast={setToast} />
      </section>
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/admin-console")({ component: AdminConsolePage });
