import { useAdminSettings } from "../hooks/use-admin-settings";
import type { AdminSettings } from "../types/admin";
import { AdminSettingsPanel } from "./admin-settings-panel";

type Props = {
  enabled: boolean;
  onToast: (message: string) => void;
};

export function AdminSettingsSection({ enabled, onToast }: Props) {
  const adminSettings = useAdminSettings(enabled);

  function toggleSetting(key: keyof AdminSettings) {
    const current = adminSettings.query.data;
    if (!current) return;
    const next = { ...current, [key]: !current[key] };
    adminSettings.update.mutate(next, {
      onSuccess: () => onToast("Admin settings updated"),
      onError: (error) =>
        onToast(error instanceof Error ? error.message : "Unable to update admin settings"),
    });
  }

  if (adminSettings.query.isPending) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm text-zinc-400">
        Loading admin settings...
      </section>
    );
  }

  if (adminSettings.query.isError) {
    return (
      <section className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-300">
        Unable to load admin settings.
      </section>
    );
  }

  if (!adminSettings.query.data) return null;

  return (
    <AdminSettingsPanel
      settings={adminSettings.query.data}
      pending={adminSettings.update.isPending}
      onToggle={toggleSetting}
    />
  );
}
