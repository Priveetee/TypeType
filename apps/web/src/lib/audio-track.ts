import type { AudioStreamItem } from "../types/api";
import type { VideoStream } from "../types/stream";

function includesOriginal(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase().includes("original");
}

function findTrackById(
  audioStreams: AudioStreamItem[] | undefined,
  trackId: string | null | undefined,
): AudioStreamItem | undefined {
  if (!audioStreams || !trackId) return undefined;
  return audioStreams.find((track) => track.audioTrackId === trackId);
}

export function getOriginalAudioTrackId(stream: VideoStream | undefined): string | null {
  if (!stream) return null;
  if (stream.originalAudioTrackId) return stream.originalAudioTrackId;
  return (
    stream.audioStreams?.find((track) => track.isOriginal && track.audioTrackId)?.audioTrackId ??
    stream.audioStreams?.find((track) => includesOriginal(track.audioTrackName ?? undefined))
      ?.audioTrackId ??
    null
  );
}

export function getPreferredDefaultAudioTrackId(stream: VideoStream | undefined): string | null {
  if (!stream) return null;
  return stream.preferredDefaultAudioTrackId ?? getOriginalAudioTrackId(stream);
}

export function getOriginalAudioLocale(stream: VideoStream | undefined): string | null {
  if (!stream) return null;
  const byOriginalId = findTrackById(stream.audioStreams, getOriginalAudioTrackId(stream));
  if (byOriginalId?.audioLocale) return byOriginalId.audioLocale;
  return (
    stream.audioStreams?.find((track) => track.isOriginal)?.audioLocale ??
    stream.audioStreams?.find((track) => includesOriginal(track.audioTrackName ?? undefined))
      ?.audioLocale ??
    null
  );
}
