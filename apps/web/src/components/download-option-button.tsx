import type { DownloadOption } from "./download-options";

type Props = {
  option: DownloadOption;
  selected: boolean;
  onSelect: () => void;
  index: number;
  compact?: boolean;
};

export function DownloadOptionButton({
  option,
  selected,
  onSelect,
  index,
  compact = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${index * 24}ms` }}
      className={`w-full rounded-lg border px-2.5 text-left transition-colors [animation:download-item-pop_0.22s_cubic-bezier(0.16,1,0.3,1)_both] ${
        compact ? "py-1.5" : "py-2"
      } ${
        selected
          ? "border-zinc-100 bg-zinc-800 text-zinc-100"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`${compact ? "text-[11px]" : "text-xs"} font-medium`}>{option.label}</p>
        {option.recommended && (
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
            Recommended
          </span>
        )}
      </div>
      <p className="text-[11px] text-zinc-500">{option.size}</p>
      {(!compact || selected) && (
        <p className="truncate text-[11px] text-zinc-400">{option.detail}</p>
      )}
    </button>
  );
}
