import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSettingsSection } from "../components/admin-settings-section";
import { AdminUsersSection } from "../components/admin-users-section";
import { Toast } from "../components/toast";
import { useAuth } from "../hooks/use-auth";
import { goto } from "../lib/route-redirect";

function AdminConsolePage() {
  const { isAdmin, me } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!isAdmin) {
    goto("/");
    return null;
  }

  return (
    <div className="flex flex-col gap-5 [animation:page-fade-in_0.2s_ease-out]">
      <AdminSettingsSection enabled={isAdmin} onToast={setToast} />
      <AdminUsersSection enabled={isAdmin} currentUserId={me?.id ?? null} onToast={setToast} />
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/admin-console")({ component: AdminConsolePage });
