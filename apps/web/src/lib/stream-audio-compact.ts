import type { AudioStreamItem } from "../types/api";

function normalizeLanguageTag(value: string | null): string {
  if (value === null || value.length === 0) return "";
  const [base] = value.toLowerCase().split("-");
  return base ?? "";
}

function isOriginalTrack(track: AudioStreamItem): boolean {
  if (track.isOriginal) return true;
  return track.audioTrackName?.toLowerCase().includes("original") ?? false;
}

export function pickCompactAudioTracks(
  audioStreams: AudioStreamItem[],
  preferredAudioLanguage: string | undefined,
  maxCompactAudioTracks: number,
): AudioStreamItem[] {
  if (audioStreams.length <= maxCompactAudioTracks) return audioStreams;
  const preferredTag = normalizeLanguageTag(preferredAudioLanguage ?? null);
  const prioritized = [...audioStreams].sort((left, right) => {
    const leftOriginal = isOriginalTrack(left);
    const rightOriginal = isOriginalTrack(right);
    if (leftOriginal !== rightOriginal) return leftOriginal ? -1 : 1;
    const leftPreferred = normalizeLanguageTag(left.audioLocale) === preferredTag;
    const rightPreferred = normalizeLanguageTag(right.audioLocale) === preferredTag;
    if (leftPreferred !== rightPreferred) return leftPreferred ? -1 : 1;
    return (right.bitrate ?? 0) - (left.bitrate ?? 0);
  });

  const selected: AudioStreamItem[] = [];
  const seenLanguages = new Set<string>();
  for (const track of prioritized) {
    const language = normalizeLanguageTag(track.audioLocale) || `und-${track.itag}`;
    if (seenLanguages.has(language)) continue;
    selected.push(track);
    seenLanguages.add(language);
    if (selected.length >= maxCompactAudioTracks) break;
  }

  return selected.length > 0 ? selected : prioritized.slice(0, maxCompactAudioTracks);
}
