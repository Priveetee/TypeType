import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "../hooks/use-settings";
import { SettingsBlocked } from "../settings/settings-blocked";
import { SettingsLanguage } from "../settings/settings-language";
import { SettingsPipePipeRestore } from "../settings/settings-pipepipe-restore";
import { SettingsPlayback } from "../settings/settings-playback";
import { SettingsPrivacy } from "../settings/settings-privacy";
import { SettingsService } from "../settings/settings-service";

function SettingsPage() {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col gap-8 [animation:page-fade-in_0.2s_ease-out]">
      <h1 className="text-lg font-semibold text-zinc-100">Settings</h1>
      <SettingsPlayback />
      {settings.defaultService === 0 && <SettingsLanguage />}
      <SettingsService />
      <SettingsPrivacy />
      <SettingsPipePipeRestore />
      <SettingsBlocked />
    </div>
  );
}

export const Route = createFileRoute("/settings")({ component: SettingsPage });
