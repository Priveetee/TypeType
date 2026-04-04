import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "../hooks/use-settings";

function PrivacyPage() {
  const { settings, update } = useSettings();
  const enabled = settings.recommendationPersonalizationEnabled;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-12">
      <div className="px-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Recommendation privacy
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
          Control personalization signals
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          Control whether TypeType uses your recommendation interactions to personalize your Home
          feed.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Recommendation personalization
        </p>
        <p className="mt-3 text-sm text-zinc-300">Personalization: ON</p>
        <p className="mt-1 text-sm text-zinc-400">
          TypeType uses recommendation interactions (impressions, clicks, watches, short skips, and
          recommendation feedback) to tune what appears in Home recommendations.
        </p>
        <p className="mt-3 text-sm text-zinc-300">Personalization: OFF</p>
        <p className="mt-1 text-sm text-zinc-400">
          TypeType stops using recommendation interactions for personalization.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-400">
          <li>POST /recommendations/events becomes a no-op (id = "disabled").</li>
          <li>Recommendation feedback is disabled.</li>
          <li>Home recommendations still work, but in non-personalized mode.</li>
        </ul>
        <div className="mt-5 inline-flex items-center gap-2">
          <span className="text-xs text-zinc-500">Disabled</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => update.mutate({ recommendationPersonalizationEnabled: !enabled })}
            className={`relative inline-flex h-7 w-14 items-center rounded-full border transition-colors ${
              enabled ? "border-zinc-300 bg-zinc-100" : "border-zinc-700 bg-zinc-800"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full transition-transform ${
                enabled ? "translate-x-8 bg-zinc-900" : "translate-x-1 bg-zinc-300"
              }`}
            />
          </button>
          <span className="text-xs text-zinc-500">Enabled</span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          What is tracked
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
          <li>Event type: impression, click, watch, short_skip.</li>
          <li>Video metadata: videoUrl, uploaderUrl, title.</li>
          <li>Optional watch details: watchRatio, watchDurationMs.</li>
          <li>Server timestamp: occurredAt.</li>
          <li>Recommendation context, for example intent or context key.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">What is sent</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
          <li>eventType</li>
          <li>videoUrl, uploaderUrl, title</li>
          <li>Optional: watchRatio, watchDurationMs</li>
          <li>Optional context hints: serviceId, intent, contextKey</li>
          <li>Home uses intent and currently defaults to intent=auto.</li>
        </ul>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });
