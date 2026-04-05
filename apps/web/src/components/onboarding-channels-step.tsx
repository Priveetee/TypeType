import type { OnboardingChannelCandidate } from "../hooks/use-onboarding-channel-search";
import type { SubscriptionItem } from "../types/user";
import { OnboardingChannelSearchBlock } from "./onboarding-channel-search-block";
import { OnboardingChannelSelectedList } from "./onboarding-channel-selected-list";
import { OnboardingChannelSuggestedBlock } from "./onboarding-channel-suggested-block";

type Props = {
  channelQuery: string;
  selectedChannels: string[];
  suggestedChannels: SubscriptionItem[];
  searchedChannels: OnboardingChannelCandidate[];
  suggestionsLoading: boolean;
  searchLoading: boolean;
  avatarResolving: boolean;
  onChangeQuery: (value: string) => void;
  onRemoveChannel: (channel: string) => void;
  onSelectSuggestion: (channelUrl: string) => void;
  onSelectSearched: (channel: OnboardingChannelCandidate) => void;
};

export function OnboardingChannelsStep({
  channelQuery,
  selectedChannels,
  suggestedChannels,
  searchedChannels,
  suggestionsLoading,
  searchLoading,
  avatarResolving,
  onChangeQuery,
  onRemoveChannel,
  onSelectSuggestion,
  onSelectSearched,
}: Props) {
  const selectedKeys = new Set(selectedChannels.map((channel) => channel.toLowerCase()));

  return (
    <section className="flex flex-col gap-5">
      <div className="border-b border-zinc-800 pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          Step 2 - Favorite channels
        </p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-100">Add channels you trust</h2>
        <p className="mt-2 text-sm text-zinc-400">
          We use this to stabilize your first recommendations before history takes over.
        </p>
      </div>

      <OnboardingChannelSearchBlock
        query={channelQuery}
        loading={searchLoading}
        resolving={avatarResolving}
        channels={searchedChannels}
        selectedKeys={selectedKeys}
        onChangeQuery={onChangeQuery}
        onSelect={onSelectSearched}
      />

      <OnboardingChannelSuggestedBlock
        channels={suggestedChannels}
        loading={suggestionsLoading}
        resolving={avatarResolving}
        selectedKeys={selectedKeys}
        onSelect={onSelectSuggestion}
      />

      <OnboardingChannelSelectedList channels={selectedChannels} onRemove={onRemoveChannel} />
    </section>
  );
}
