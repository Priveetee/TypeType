import { createFileRoute } from "@tanstack/react-router";
import { ContinueWatching } from "../components/continue-watching";
import { HomeFallbackSection } from "../components/home-fallback-section";
import { HomeRecommendationsSection } from "../components/home-recommendations-section";
import { useAuth } from "../hooks/use-auth";

function HomePage() {
  const { isAuthed } = useAuth();
  const title = isAuthed ? "Recommended" : "Trending";

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <ContinueWatching />
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-soft">{title}</p>
        {isAuthed ? <HomeRecommendationsSection /> : <HomeFallbackSection />}
      </section>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: HomePage });
