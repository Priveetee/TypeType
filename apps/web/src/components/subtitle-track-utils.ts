import { toProxiedVttUrl } from "../lib/proxy";
import type { SubtitleItem } from "../types/api";

type SafeSubtitleTrack = {
  key: string;
  src: string;
  label: string;
  lang: string;
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function buildSafeSubtitleTracks(
  subtitles: SubtitleItem[] | undefined,
): SafeSubtitleTrack[] {
  if (!subtitles || subtitles.length === 0) return [];

  const tracks: SafeSubtitleTrack[] = [];

  for (let i = 0; i < subtitles.length; i++) {
    const item = subtitles[i];
    if (!item) continue;

    const rawUrl = normalizeText(item.url);
    if (!rawUrl) continue;

    let src = "";
    try {
      src = toProxiedVttUrl(rawUrl);
    } catch {
      continue;
    }

    const lang = normalizeText(item.languageTag).toLowerCase() || `und-${i}`;
    const label = normalizeText(item.displayLanguageName) || lang;
    const key = `${lang}-${rawUrl}-${i}`;

    tracks.push({ key, src, label, lang });
  }

  return tracks;
}
