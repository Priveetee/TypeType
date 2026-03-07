import { createFileRoute } from "@tanstack/react-router";
import { SettingsData } from "../settings/settings-data";
import { SettingsPlayback } from "../settings/settings-playback";
import { SettingsPrivacy } from "../settings/settings-privacy";
import { SettingsService } from "../settings/settings-service";

function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 [animation:page-fade-in_0.2s_ease-out]">
      <h1 className="text-lg font-semibold text-zinc-100">Settings</h1>
      <SettingsPlayback />
      <SettingsService />
      <SettingsPrivacy />
      <SettingsData />
    </div>
  );
}

export const Route = createFileRoute("/settings")({ component: SettingsPage });
