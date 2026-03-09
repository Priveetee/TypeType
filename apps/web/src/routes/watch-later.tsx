import { createFileRoute, Link } from "@tanstack/react-router";
import { useWatchLater } from "../hooks/use-watch-later";
import { formatDuration } from "../lib/format";

function WatchLaterPage() {
  const { videos, remove } = useWatchLater();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-base font-semibold text-zinc-100">Watch Later</h1>
      {videos.length === 0 ? (
        <p className="text-zinc-400 text-sm">No videos saved.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {videos.map((item) => (
            <li key={item.url} className="flex items-center gap-4 bg-zinc-900 rounded-lg p-3">
              <Link to="/watch" search={{ v: item.url }} className="flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-28 h-16 object-cover rounded"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Link
                  to="/watch"
                  search={{ v: item.url }}
                  className="text-sm font-medium text-zinc-100 truncate hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-zinc-500">{formatDuration(item.duration)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove.mutate(item.url)}
                className="flex-shrink-0 text-xs text-zinc-500 hover:text-zinc-100 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const Route = createFileRoute("/watch-later")({ component: WatchLaterPage });
