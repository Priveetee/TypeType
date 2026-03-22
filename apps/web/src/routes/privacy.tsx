import { createFileRoute } from "@tanstack/react-router";
import { useRecommendationTrackingStore } from "../stores/recommendation-tracking-store";

function PrivacyPage() {
  const enabled = useRecommendationTrackingStore((s) => s.enabled);
  const setEnabled = useRecommendationTrackingStore((s) => s.setEnabled);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-100">Recommendation privacy</h1>

      <p className="text-sm leading-relaxed text-zinc-300">
        This page explains what recommendation tracking does and lets you disable it completely.
      </p>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-medium text-zinc-100">Recommendation tracking</p>
        <p className="mt-2 text-sm text-zinc-400">
          If disabled, TypeType sends zero recommendation events and zero recommendation feedback.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-zinc-500">Disabled</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
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

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-medium text-zinc-100">What is tracked</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
          <li>Impression (when a recommendation card is visible)</li>
          <li>Click (when you open a recommendation)</li>
          <li>Watch ratio (approximate progress on watch exit)</li>
          <li>Feedback actions (not interested / less from channel)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-medium text-zinc-100">What is sent</p>
        <p className="mt-2 text-sm text-zinc-300">
          `videoUrl`, `uploaderUrl`, `title`, optional `watchRatio`, and `occurredAt` timestamp.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });
