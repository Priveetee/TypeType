import { createFileRoute } from "@tanstack/react-router";
import { RecommendationSettingsShell } from "../components/recommendation-settings-shell";

function OnboardingPage() {
  return <RecommendationSettingsShell />;
}

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });
