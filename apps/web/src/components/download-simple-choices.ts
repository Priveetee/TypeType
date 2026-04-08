import type { DownloadMode, DownloadOption } from "./download-options";

type SimpleChoice = {
  id: string;
  title: string;
  option: DownloadOption;
};

export function buildSimpleChoices(options: DownloadOption[], mode: DownloadMode): SimpleChoice[] {
  if (options.length === 0) return [];
  const best = options[0];
  const small =
    mode === "video"
      ? (options.find((option) => option.height === 360) ??
        [...options].reverse().find((option) => (option.height ?? 0) >= 360) ??
        options[options.length - 1])
      : options[options.length - 1];
  const balanced =
    options.find((option) => option.recommended) ?? options[Math.floor(options.length / 2)];
  const raw = [
    { id: best.id, title: mode === "video" ? "Best quality" : "Best sound", option: best },
    { id: balanced.id, title: "Balanced", option: balanced },
    { id: small.id, title: mode === "video" ? "Small size (360p)" : "Small size", option: small },
  ];
  const unique = new Map<string, SimpleChoice>();
  raw.forEach((choice) => {
    if (!unique.has(choice.id)) unique.set(choice.id, choice);
  });
  return Array.from(unique.values());
}
