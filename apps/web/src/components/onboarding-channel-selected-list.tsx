type Props = {
  channels: string[];
  onRemove: (channel: string) => void;
};

export function OnboardingChannelSelectedList({ channels, onRemove }: Props) {
  if (channels.length === 0) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Selected channels</p>
      <div className="mt-2 flex flex-col gap-2 text-xs">
        {channels.map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() => onRemove(channel)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-left text-zinc-300 hover:border-zinc-600"
          >
            {channel}
          </button>
        ))}
      </div>
    </div>
  );
}
