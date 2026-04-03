import type { MediaSrc } from "@vidstack/react";
import type { AudioStreamItem } from "../types/api";
import type { VideoStream } from "../types/stream";
import { buildDashManifest } from "./dash-manifest";
import { API_BASE as BASE } from "./env";
import { buildNicoMasterPlaylist } from "./nico-manifest";
import { detectProvider } from "./provider";
import { proxyDashManifest } from "./proxy";

type ResolveManifestOptions = {
  preferNativeManifest?: boolean;
  compactAudioTracks?: boolean;
  preferredAudioLanguage?: string;
  preferOriginalLanguage?: boolean;
  maxCompactAudioTracks?: number;
};

function normalizeLanguageTag(value: string | null): string {
  if (value === null || value.length === 0) return "";
  const [base] = value.toLowerCase().split("-");
  return base ?? "";
}

function pickCompactAudioTracks(
  audioStreams: AudioStreamItem[],
  preferredAudioLanguage: string | undefined,
  maxCompactAudioTracks: number,
): AudioStreamItem[] {
  if (audioStreams.length <= maxCompactAudioTracks) return audioStreams;
  const preferredTag = normalizeLanguageTag(preferredAudioLanguage ?? null);
  const prioritized = [...audioStreams].sort((left, right) => {
    const leftOriginal = left.audioTrackName?.toLowerCase().includes("original") ?? false;
    const rightOriginal = right.audioTrackName?.toLowerCase().includes("original") ?? false;
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

function fallbackSrc(
  stream: VideoStream,
  maxHeight: number | undefined,
  compactAudioTracks: boolean,
  preferredAudioLanguage: string | undefined,
  maxCompactAudioTracks: number,
): MediaSrc {
  const audioStreams = compactAudioTracks
    ? pickCompactAudioTracks(
        stream.audioStreams ?? [],
        preferredAudioLanguage,
        maxCompactAudioTracks,
      )
    : (stream.audioStreams ?? []);

  if (stream.videoOnlyStreams?.length && stream.audioStreams?.length) {
    const built = buildDashManifest(
      stream.videoOnlyStreams,
      audioStreams,
      stream.duration,
      maxHeight,
    );
    if (built) return { src: built, type: "application/dash+xml" };
  }
  return {
    src: `${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`,
    type: "application/dash+xml",
  };
}

function hasCompatibleMp4(stream: VideoStream): boolean {
  const videos = stream.videoOnlyStreams ?? [];
  const audios = stream.audioStreams ?? [];
  const hasMp4Video = videos.some(
    (video) =>
      typeof video.codec === "string" &&
      video.codec.startsWith("avc1") &&
      (video.mimeType?.includes("video/mp4") ?? true),
  );
  const hasMp4Audio = audios.some(
    (audio) =>
      typeof audio.codec === "string" &&
      (audio.codec.startsWith("mp4a") || audio.codec === "mp4a") &&
      (audio.mimeType?.includes("audio/mp4") ?? true),
  );
  return hasMp4Video && hasMp4Audio;
}

export function resolveManifestSrc(
  stream: VideoStream,
  isLive: boolean,
  nativeFailed: boolean,
  qualityFailed: boolean,
  options?: ResolveManifestOptions,
): MediaSrc {
  const isShort = Boolean(stream.isShortFormContent) || stream.id.includes("/shorts/");
  const preferNativeManifest = options?.preferNativeManifest ?? !isShort;
  const compactAudioTracks = options?.compactAudioTracks ?? isShort;
  const maxCompactAudioTracks = options?.maxCompactAudioTracks ?? (isShort ? 3 : 8);
  const provider = detectProvider(stream.id);

  if (stream.hlsUrl) {
    return {
      src: proxyDashManifest(`${BASE}/streams/hls-manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/x-mpegurl",
    };
  }

  if (provider === "nicovideo" && stream.videoOnlyStreams?.length) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const src = buildNicoMasterPlaylist(stream.videoOnlyStreams, stream.audioStreams ?? [], origin);
    if (src) return { src, type: "application/x-mpegurl" };
    return {
      src: proxyDashManifest(
        `${BASE}/proxy/nicovideo?url=${encodeURIComponent(stream.videoOnlyStreams[0].url)}`,
      ),
      type: "application/x-mpegurl",
    };
  }

  if (provider === "bilibili") {
    return {
      src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/dash+xml",
    };
  }

  if (!isLive && stream.videoOnlyStreams?.length && !nativeFailed && preferNativeManifest) {
    return {
      src: proxyDashManifest(
        `${BASE}/streams/native-manifest?url=${encodeURIComponent(stream.id)}`,
      ),
      type: "application/dash+xml",
    };
  }

  if (!hasCompatibleMp4(stream)) {
    return {
      src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/dash+xml",
    };
  }

  return fallbackSrc(
    stream,
    qualityFailed ? 720 : undefined,
    compactAudioTracks,
    options?.preferredAudioLanguage,
    maxCompactAudioTracks,
  );
}
