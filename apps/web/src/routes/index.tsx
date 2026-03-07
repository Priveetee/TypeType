import { createFileRoute } from "@tanstack/react-router";
import { VideoCardSkeleton } from "../components/video-card-skeleton";
import { VideoGrid } from "../components/video-grid";
import { useTrending } from "../hooks/use-trending";
import { useServiceStore } from "../stores/service-store";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

function HomePage() {
  const service = useServiceStore((s) => s.service);
  const { data: streams, isLoading } = useTrending(service);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {SKELETON_KEYS.map((k) => (
          <VideoCardSkeleton key={k} />
        ))}
      </div>
    );
  }

  return <VideoGrid streams={streams ?? []} />;
}

export const Route = createFileRoute("/")({ component: HomePage });
