import type { OnboardingChannelCandidate } from "../hooks/use-onboarding-channel-search";
import { OnboardingChannelOptionRow } from "./onboarding-channel-option-row";

type Props = {
  query: string;
  loading: boolean;
  resolving: boolean;
  channels: OnboardingChannelCandidate[];
  selectedKeys: Set<string>;
  onChangeQuery: (value: string) => void;
  onSelect: (channel: OnboardingChannelCandidate) => void;
};

export function OnboardingChannelSearchBlock({
  query,
  loading,
  resolving,
  channels,
  selectedKeys,
  onChangeQuery,
  onSelect,
}: Props) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Find channels quickly</p>
      <input
        type="text"
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        placeholder="Search a YouTube channel"
        className="mt-2 h-11 sm:h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
      />
      {loading && <p className="mt-2 text-xs text-zinc-500">Searching channels...</p>}
      {channels.length > 0 && (
        <div className="mt-3 grid gap-2">
          {channels.map((channel, index) => (
            <div
              key={channel.channelUrl}
              className="animate-card-pop-in"
              style={{ animationDelay: `${Math.min(index * 40, 280)}ms` }}
            >
              <OnboardingChannelOptionRow
                name={channel.name}
                avatarUrl={channel.avatarUrl.trim()}
                fallbackLabel={channel.name || channel.channelUrl}
                subtitle={channel.channelUrl}
                active={selectedKeys.has(channel.channelUrl.toLowerCase())}
                onClick={() => onSelect(channel)}
              />
            </div>
          ))}
        </div>
      )}
      {resolving && <p className="mt-2 text-xs text-zinc-500">Resolving avatars...</p>}
    </div>
  );
}
