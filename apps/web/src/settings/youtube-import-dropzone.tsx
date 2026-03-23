import { useState } from "react";

type Props = {
  disabled?: boolean;
  onSelectFiles: (files: File[]) => void;
};

function pickZipFiles(list: FileList | null): File[] {
  if (!list || list.length === 0) return [];
  return Array.from(list).filter((file) => file.name.toLowerCase().endsWith(".zip"));
}

export function YoutubeImportDropzone({ disabled, onSelectFiles }: Props) {
  const [over, setOver] = useState(false);
  const zoneTone = disabled
    ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
    : over
      ? "border-zinc-300 bg-zinc-800 text-zinc-100"
      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500";

  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${zoneTone}`}
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (disabled) return;
        const files = pickZipFiles(e.dataTransfer.files);
        if (files.length === 0) return;
        onSelectFiles(files);
      }}
    >
      <span className="text-sm text-zinc-200">Drop one or more Takeout ZIP files here</span>
      <span className="mt-1 text-xs text-zinc-500">or click to select multiple ZIP files</span>
      <input
        type="file"
        multiple
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const files = pickZipFiles(event.target.files);
          event.target.value = "";
          if (files.length === 0) return;
          onSelectFiles(files);
        }}
      />
    </label>
  );
}
