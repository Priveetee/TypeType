import { createFileRoute } from "@tanstack/react-router";
import { VideoCardSkeleton } from "../components/video-card-skeleton";
import { VideoGrid } from "../components/video-grid";
import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useSettings } from "../hooks/use-settings";
import { useTrending } from "../hooks/use-trending";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

function HomePage() {
  const { settings } = useSettings();
  const { data: streams, isLoading } = useTrending(settings.defaultService);
  const { filter } = useBlockedFilter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {SKELETON_KEYS.map((k) => (
          <VideoCardSkeleton key={k} />
        ))}
      </div>
    );
  }

  return <VideoGrid streams={filter(streams ?? [])} />;
}

export const Route = createFileRoute("/")({ component: HomePage });
