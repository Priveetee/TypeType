type Props = {
  channels: string[];
  onRemove: (channel: string) => void;
};

export function OnboardingChannelSelectedList({ channels, onRemove }: Props) {
  if (channels.length === 0) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-fg-soft">Selected channels</p>
      <div className="mt-2 flex flex-col gap-2 text-xs">
        {channels.map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() => onRemove(channel)}
            className="rounded-lg border border-border bg-app px-3 py-2.5 sm:py-2 text-left text-fg-muted hover:border-border-strong"
          >
            {channel}
          </button>
        ))}
      </div>
    </div>
  );
}
