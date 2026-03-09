import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { PageSpinner } from "../components/page-spinner";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { VideoCard } from "../components/video-card";
import { useChannel } from "../hooks/use-channel";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { formatViews } from "../lib/format";

function ChannelPage() {
  const { url } = Route.useSearch();
  const { meta, videos, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannel(url);
  const { add, remove, isSubscribed } = useSubscriptions();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const subscribed = isSubscribed(url);

  function handleSubscribe() {
    if (!meta) return;
    if (subscribed) {
      remove.mutate(url);
    } else {
      add.mutate({ channelUrl: url, name: meta.name, avatarUrl: meta.avatarUrl });
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col gap-6">
      {meta && (
        <div className="flex flex-col gap-4">
          {meta.bannerUrl && (
            <img src={meta.bannerUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={meta.avatarUrl} alt={meta.name} className="w-14 h-14 rounded-full" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-zinc-100">{meta.name}</h1>
                <p className="text-sm text-zinc-500">
                  {formatViews(meta.subscriberCount)} subscribers
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubscribe}
              aria-pressed={subscribed}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                subscribed
                  ? "ring-1 ring-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                  : "bg-zinc-100 text-zinc-900 hover:bg-white"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((v) => (
          <VideoCard key={v.id} stream={v} />
        ))}
      </div>
      <ScrollSentinel onIntersect={loadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
    </div>
  );
}

export const Route = createFileRoute("/channel")({
  validateSearch: (search: Record<string, unknown>) => ({
    url: typeof search.url === "string" ? search.url : "",
  }),
  component: ChannelPage,
});
