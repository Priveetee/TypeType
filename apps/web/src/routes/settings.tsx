import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "../hooks/use-settings";
import { goto } from "../lib/route-redirect";
import { SettingsBlocked } from "../settings/settings-blocked";
import { SettingsLanguage } from "../settings/settings-language";
import { SettingsPlayback } from "../settings/settings-playback";
import { SettingsPrivacy } from "../settings/settings-privacy";
import { SettingsService } from "../settings/settings-service";

function SettingsPage() {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col gap-6 sm:gap-8 [animation:page-fade-in_0.2s_ease-out]">
      <h1 className="text-lg font-semibold text-zinc-100">Settings</h1>
      <SettingsPlayback />
      {settings.defaultService === 0 && <SettingsLanguage />}
      <SettingsService />
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">
          Recommendations
        </p>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 px-4 py-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Tune recommendation profile</span>
            <span className="text-xs text-zinc-500">Adjust interests and favorite channels.</span>
          </div>
          <button
            type="button"
            onClick={() => goto("/settings/recommendations")}
            className="h-9 w-full rounded-md bg-zinc-900 px-2.5 text-xs text-zinc-300 transition-colors hover:text-zinc-100 sm:h-8 sm:w-auto"
          >
            Open
          </button>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Migration</p>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 px-4 py-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Import from YouTube or PipePipe</span>
            <span className="text-xs text-zinc-500">Open the dedicated import page.</span>
          </div>
          <button
            type="button"
            onClick={() => goto("/import")}
            className="h-9 w-full rounded-md bg-zinc-900 px-2.5 text-xs text-zinc-300 transition-colors hover:text-zinc-100 sm:h-8 sm:w-auto"
          >
            Open import
          </button>
        </div>
      </section>
      <SettingsPrivacy />
      <SettingsBlocked />
    </div>
  );
}

export const Route = createFileRoute("/settings")({ component: SettingsPage });
