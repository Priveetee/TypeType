import { createFileRoute } from "@tanstack/react-router";
import { ChannelAvatar } from "../components/channel-avatar";
import { PageSpinner } from "../components/page-spinner";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { VideoCard } from "../components/video-card";
import { VerifiedBadgeIcon } from "../components/watch-icons";
import { useBlockedFilter } from "../hooks/use-blocked-filter";
import { useChannel } from "../hooks/use-channel";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { ApiError } from "../lib/api";
import { formatViews } from "../lib/format";

function ChannelPage() {
  const { url } = Route.useSearch();
  const {
    meta,
    videos,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChannel(url);
  const { add, remove, isSubscribed } = useSubscriptions();
  const { filter } = useBlockedFilter();

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
  if (isError) {
    const message = error instanceof ApiError ? error.message : "Unable to load channel right now.";
    return (
      <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-3 max-w-xl">
        <p className="text-sm text-fg">{message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="h-9 w-fit rounded-md bg-fg px-3 text-xs font-medium text-app hover:bg-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {meta && (
        <div className="flex flex-col gap-4">
          {meta.bannerUrl && (
            <img src={meta.bannerUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ChannelAvatar src={meta.avatarUrl} name={meta.name} className="w-14 h-14" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-fg flex items-center gap-1.5">
                  {meta.name}
                  {meta.isVerified && <VerifiedBadgeIcon />}
                </h1>
                <p className="text-sm text-fg-soft">
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
                  ? "ring-1 ring-border-strong bg-surface-strong text-fg hover:bg-surface-soft"
                  : "bg-fg text-app hover:bg-white"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {filter(videos).map((v, index) => (
          <div
            key={v.id}
            className="animate-card-pop-in"
            style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
          >
            <VideoCard stream={v} />
          </div>
        ))}
      </div>
      <ScrollSentinel onIntersect={fetchNextPage} enabled={hasNextPage && !isFetchingNextPage} />
    </div>
  );
}

export const Route = createFileRoute("/channel")({
  validateSearch: (search: Record<string, unknown>) => ({
    url: typeof search.url === "string" ? search.url : "",
  }),
  component: ChannelPage,
});
