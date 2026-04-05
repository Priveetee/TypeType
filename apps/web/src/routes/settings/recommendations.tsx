import { createFileRoute } from "@tanstack/react-router";
import { RecommendationSettingsShell } from "../../components/recommendation-settings-shell";

function RecommendationsSettingsPage() {
  return <RecommendationSettingsShell mode="settings" />;
}

export const Route = createFileRoute("/settings/recommendations")({
  component: RecommendationsSettingsPage,
});
