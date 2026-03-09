import { useHistory } from "../hooks/use-history";
import { ContinueCard } from "./continue-card";

const MAX_ITEMS = 12;

function isInProgress(progress: number, duration: number): boolean {
  return progress > 0 && duration > 0 && progress < duration * 0.9;
}

export function ContinueWatching() {
  const { query } = useHistory();
  const items = (query.data ?? [])
    .filter((h) => isInProgress(h.progress, h.duration))
    .sort((a, b) => b.watchedAt - a.watchedAt)
    .slice(0, MAX_ITEMS);

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">
        Continue watching
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {items.map((item) => (
          <ContinueCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
