import { createFileRoute } from "@tanstack/react-router";
import { ShortsPlayerShell } from "../components/shorts-player-shell";

function ShortsPage() {
  return <ShortsPlayerShell />;
}

export const Route = createFileRoute("/shorts")({ component: ShortsPage });
