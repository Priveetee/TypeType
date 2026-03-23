type Props = {
  progress: number | null;
  active?: boolean;
};

export function YoutubeImportProgressBar({ progress, active }: Props) {
  if (progress === null) return null;
  const value = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="px-4 pb-4">
      <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Import progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full bg-zinc-300 transition-all duration-300 ${
            active ? "[animation:pulse_1.2s_ease-in-out_infinite]" : ""
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
