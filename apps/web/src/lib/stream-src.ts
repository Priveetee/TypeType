import type { VideoStream } from "../types/stream";
import { buildBilibiliDashManifest } from "./bilibili-manifest";
import { buildDashManifest } from "./dash-manifest";
import { API_BASE as BASE, toApiUrl } from "./env";
import { buildNicoHlsManifest } from "./nico-hls-manifest";
import { isCompatibilityPlaybackMode } from "./playback-mode";
import { detectProvider } from "./provider";
import { proxyDashManifest } from "./proxy";
import { pickCompactAudioTracks } from "./stream-audio-compact";
import { hasCompatibleMp4, pickCompatibleProgressiveSrc } from "./stream-compatibility";
import type { MediaSrc } from "./vidstack";
import { youtubeVideoIdFromUrl } from "./watch-url";

type ResolveManifestOptions = {
  preferNativeManifest?: boolean;
  compactAudioTracks?: boolean;
  preferredAudioLanguage?: string;
  preferOriginalLanguage?: boolean;
  maxCompactAudioTracks?: number;
  compatibilityMode?: boolean;
  enableHighQualityPlayback?: boolean;
  highQualityFailed?: boolean;
  hlsFailed?: boolean;
  allowServerManifests?: boolean;
  bilibiliVariant?: number;
  sabrFailed?: boolean;
};

export function isSignedHlsManifestUrl(value: string): boolean {
  try {
    const url = new URL(value, "https://typetype.invalid");
    return url.pathname.endsWith("/streams/hls-manifest") && url.searchParams.has("token");
  } catch {
    return false;
  }
}

export function resolveHlsManifestUrl(stream: VideoStream): string {
  if (stream.hlsUrl && isSignedHlsManifestUrl(stream.hlsUrl)) return toApiUrl(stream.hlsUrl);
  return proxyDashManifest(`${BASE}/streams/hls-manifest?url=${encodeURIComponent(stream.id)}`);
}

function fallbackSrc(
  stream: VideoStream,
  maxHeight: number | undefined,
  compactAudioTracks: boolean,
  preferredAudioLanguage: string | undefined,
  maxCompactAudioTracks: number,
  allowServerManifests: boolean,
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
  if (!allowServerManifests) {
    const progressiveSrc = pickCompatibleProgressiveSrc(stream);
    if (progressiveSrc) return progressiveSrc;
  }
  return {
    src: `${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`,
    type: "application/dash+xml",
  };
}

export function resolveManifestSrc(
  stream: VideoStream,
  isLive: boolean,
  nativeFailed: boolean,
  qualityFailed: boolean,
  options?: ResolveManifestOptions,
): MediaSrc {
  const isShort = Boolean(stream.isShortFormContent) || stream.id.includes("/shorts/");
  const compatibilityMode = options?.compatibilityMode ?? isCompatibilityPlaybackMode();
  const preferNativeManifest = (options?.preferNativeManifest ?? !isShort) && !compatibilityMode;
  const compactAudioTracks = options?.compactAudioTracks ?? isShort;
  const maxCompactAudioTracks = options?.maxCompactAudioTracks ?? (isShort ? 3 : 8);
  const allowServerManifests = options?.allowServerManifests ?? true;
  const provider = detectProvider(stream.id);
  const isFirefox = typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox/");
  const safeMaxHeight = qualityFailed ? 720 : 1080;

  const sabrVideoId =
    provider === "youtube" && !isLive && !isShort && !options?.sabrFailed
      ? youtubeVideoIdFromUrl(stream.id)
      : null;
  if (sabrVideoId) {
    return { src: toApiUrl(`/sabr/manifest/${sabrVideoId}`), type: "application/dash+xml" };
  }

  if (stream.hlsUrl && !options?.hlsFailed && (isLive || isSignedHlsManifestUrl(stream.hlsUrl))) {
    return {
      src: resolveHlsManifestUrl(stream),
      type: "application/x-mpegurl",
    };
  }

  if (provider === "nicovideo") {
    const built = buildNicoHlsManifest(stream.videoOnlyStreams ?? [], stream.audioStreams ?? []);
    if (built) return { src: built, type: "application/x-mpegurl" };
  }

  if (provider === "bilibili") {
    const built = buildBilibiliDashManifest(
      stream.videoOnlyStreams ?? [],
      stream.audioStreams ?? [],
      stream.duration,
      options?.bilibiliVariant,
    );
    if (built) return { src: built, type: "application/dash+xml" };
    if (allowServerManifests) {
      return {
        src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
        type: "application/dash+xml",
      };
    }
  }

  if (!isLive && compatibilityMode) {
    const progressiveSrc = pickCompatibleProgressiveSrc(stream);
    if (progressiveSrc) return progressiveSrc;
  }

  if (
    !isLive &&
    provider === "youtube" &&
    options?.enableHighQualityPlayback &&
    !options.highQualityFailed &&
    allowServerManifests &&
    stream.videoOnlyStreams?.length &&
    !compatibilityMode
  ) {
    return {
      src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/dash+xml",
    };
  }

  if (
    !isLive &&
    stream.videoOnlyStreams?.length &&
    !nativeFailed &&
    preferNativeManifest &&
    allowServerManifests &&
    !isFirefox &&
    !compatibilityMode
  ) {
    return {
      src: proxyDashManifest(
        `${BASE}/streams/native-manifest?url=${encodeURIComponent(stream.id)}`,
      ),
      type: "application/dash+xml",
    };
  }

  if (!hasCompatibleMp4(stream) && allowServerManifests) {
    return {
      src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/dash+xml",
    };
  }

  return fallbackSrc(
    stream,
    safeMaxHeight,
    compactAudioTracks,
    options?.preferredAudioLanguage,
    maxCompactAudioTracks,
    allowServerManifests,
  );
}
