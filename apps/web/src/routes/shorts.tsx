import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ShortsPlayerShell } from "../components/shorts-player-shell";

const SHORTS_BETA_BANNER_KEY = "shorts-beta-banner-dismissed";

function ShortsBetaBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const hidden = window.localStorage.getItem(SHORTS_BETA_BANNER_KEY) === "1";
    setDismissed(hidden);
  }, []);

  function dismissBanner() {
    window.localStorage.setItem(SHORTS_BETA_BANNER_KEY, "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      className="pointer-events-none fixed left-2 right-2 z-40 flex justify-center sm:left-4 sm:right-4"
      style={{ top: "calc(3.5rem + env(safe-area-inset-top, 0px) + 0.5rem)" }}
    >
      <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-xl border border-border-strong bg-app/95 px-3 py-2 backdrop-blur sm:px-4">
        <p className="text-xs text-fg-muted sm:text-sm">
          The shorts page is still beta and some bugs can happen.
        </p>
        <button
          type="button"
          onClick={dismissBanner}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-fg-muted transition-colors hover:bg-surface-strong hover:text-fg"
          aria-label="Dismiss beta notice"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function ShortsPage() {
  const { v } = Route.useSearch();
  return (
    <>
      <ShortsBetaBanner />
      <ShortsPlayerShell targetUrl={v} />
    </>
  );
}

export const Route = createFileRoute("/shorts")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : undefined,
  }),
  component: ShortsPage,
});
