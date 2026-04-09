import type { DownloadMode, DownloadOption } from "./download-options";

type SimpleChoice = {
  id: string;
  title: string;
  option: DownloadOption;
};

function effectiveVideoHeight(option: DownloadOption): number {
  if (typeof option.height !== "number" || option.height <= 0) return 0;
  if (typeof option.width !== "number" || option.width <= 0) return option.height;
  return Math.min(option.height, option.width);
}

export function buildSimpleChoices(options: DownloadOption[], mode: DownloadMode): SimpleChoice[] {
  if (options.length === 0) return [];
  const best = options[0];
  const small =
    mode === "video"
      ? (options.find((option) => effectiveVideoHeight(option) === 360) ??
        [...options].reverse().find((option) => effectiveVideoHeight(option) >= 360) ??
        options[options.length - 1])
      : options[options.length - 1];
  const balanced =
    options.find((option) => option.recommended) ?? options[Math.floor(options.length / 2)];
  const balancedHeight = effectiveVideoHeight(balanced);
  const balancedTitle =
    mode === "video" && balancedHeight === 1080
      ? "Recommended (1080p)"
      : mode === "video" && balancedHeight === 720
        ? "Recommended (720p)"
        : mode === "audio"
          ? "Recommended"
          : "Balanced";
  const raw = [
    { id: best.id, title: mode === "video" ? "Best quality" : "Best sound", option: best },
    { id: balanced.id, title: balancedTitle, option: balanced },
    { id: small.id, title: mode === "video" ? "Small size (360p)" : "Small size", option: small },
  ];
  const unique = new Map<string, SimpleChoice>();
  raw.forEach((choice) => {
    if (!unique.has(choice.id)) unique.set(choice.id, choice);
  });
  return Array.from(unique.values());
}
