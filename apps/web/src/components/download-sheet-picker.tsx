import { useMemo, useState } from "react";
import { DownloadModeButton } from "./download-mode-button";
import { DownloadOptionButton } from "./download-option-button";
import type { DownloadMode, DownloadOption } from "./download-options";
import { buildSimpleChoices } from "./download-simple-choices";

type Props = {
  mode: DownloadMode;
  options: DownloadOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onMode: (next: DownloadMode) => void;
};

export function DownloadSheetPicker({ mode, options, selectedId, onSelect, onMode }: Props) {
  const [showAllFormats, setShowAllFormats] = useState(false);
  const modeOptions = options.filter((option) => option.mode === mode);
  const simpleChoices = useMemo(() => buildSimpleChoices(modeOptions, mode), [modeOptions, mode]);
  const selected = modeOptions.find((option) => option.id === selectedId) ?? modeOptions[0];

  return (
    <>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <DownloadModeButton
          active={mode === "video"}
          onClick={() => onMode("video")}
          label="Video"
        />
        <DownloadModeButton
          active={mode === "audio"}
          onClick={() => onMode("audio")}
          label="Audio"
        />
      </div>
      {!showAllFormats && (
        <div className="space-y-2">
          {simpleChoices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                selected?.id === choice.id
                  ? "border-zinc-100 bg-zinc-800 text-zinc-100"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              <p className="text-sm font-medium">{choice.title}</p>
              <p className="text-xs text-zinc-400">{choice.option.label}</p>
              <p className="text-xs text-zinc-500">{choice.option.size}</p>
            </button>
          ))}
        </div>
      )}
      {showAllFormats && (
        <div
          className="max-h-[44svh] space-y-1.5 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-width:thin] [scrollbar-color:var(--color-zinc-600)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600/80 [&::-webkit-scrollbar-track]:bg-transparent md:max-h-[52svh]"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          {modeOptions.map((option, index) => (
            <DownloadOptionButton
              key={option.id}
              option={option}
              selected={option.id === selected?.id}
              onSelect={() => onSelect(option.id)}
              index={index}
              compact
            />
          ))}
        </div>
      )}
      {modeOptions.length > simpleChoices.length && (
        <button
          type="button"
          onClick={() => setShowAllFormats((open) => !open)}
          className="mt-2 w-full rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
        >
          {showAllFormats ? "Simple view" : `All formats (${modeOptions.length})`}
        </button>
      )}
    </>
  );
}
