import type { SubscriptionItem } from "../types/user";
import { OnboardingChannelOptionRow } from "./onboarding-channel-option-row";

type Props = {
  channels: SubscriptionItem[];
  loading: boolean;
  resolving: boolean;
  selectedKeys: Set<string>;
  onSelect: (channelUrl: string) => void;
};

export function OnboardingChannelSuggestedBlock({
  channels,
  loading,
  resolving,
  selectedKeys,
  onSelect,
}: Props) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-fg-soft">
        Suggested from subscriptions
      </p>
      {loading && <p className="mt-2 text-xs text-fg-soft">Loading suggestions...</p>}
      {!loading && channels.length === 0 && (
        <p className="mt-2 text-xs text-fg-soft">No subscriptions available yet.</p>
      )}
      {channels.length > 0 && (
        <div className="mt-3 grid gap-2">
          {channels.map((channel, index) => (
            <div
              key={channel.channelUrl}
              className="animate-card-pop-in"
              style={{ animationDelay: `${Math.min(index * 32, 224)}ms` }}
            >
              <OnboardingChannelOptionRow
                name={channel.name}
                avatarUrl={channel.avatarUrl.trim()}
                fallbackLabel={channel.name || channel.channelUrl}
                active={selectedKeys.has(channel.channelUrl.toLowerCase())}
                onClick={() => onSelect(channel.channelUrl)}
              />
            </div>
          ))}
        </div>
      )}
      {resolving && <p className="mt-2 text-xs text-fg-soft">Resolving avatars...</p>}
    </div>
  );
}
