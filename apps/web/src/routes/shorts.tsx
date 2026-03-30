import { createFileRoute } from "@tanstack/react-router";
import { ShortsPlayerShell } from "../components/shorts-player-shell";

function ShortsPage() {
  const { v } = Route.useSearch();
  return <ShortsPlayerShell targetUrl={v} />;
}

export const Route = createFileRoute("/shorts")({
  validateSearch: (search: Record<string, unknown>) => ({
    v: typeof search.v === "string" ? search.v : undefined,
  }),
  component: ShortsPage,
});
