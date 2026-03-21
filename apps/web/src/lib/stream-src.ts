import type { MediaSrc } from "@vidstack/react";
import type { VideoStream } from "../types/stream";
import { buildDashManifest } from "./dash-manifest";
import { API_BASE as BASE } from "./env";
import { buildNicoMasterPlaylist } from "./nico-manifest";
import { detectProvider } from "./provider";
import { proxyDashManifest } from "./proxy";

function fallbackSrc(stream: VideoStream, maxHeight?: number): MediaSrc {
  if (stream.videoOnlyStreams?.length && stream.audioStreams?.length) {
    const built = buildDashManifest(
      stream.videoOnlyStreams,
      stream.audioStreams,
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

export function resolveManifestSrc(
  stream: VideoStream,
  isLive: boolean,
  nativeFailed: boolean,
  qualityFailed: boolean,
): MediaSrc {
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

  const isMultiLanguage = stream.audioStreams?.some((a) => a.audioTrackId !== null) ?? false;

  if (!isLive && stream.videoOnlyStreams?.length && isMultiLanguage) {
    return {
      src: proxyDashManifest(`${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`),
      type: "application/dash+xml",
    };
  }

  if (!isLive && stream.videoOnlyStreams?.length && !nativeFailed) {
    return {
      src: proxyDashManifest(
        `${BASE}/streams/native-manifest?url=${encodeURIComponent(stream.id)}`,
      ),
      type: "application/dash+xml",
    };
  }

  return fallbackSrc(stream, qualityFailed ? 720 : undefined);
}
