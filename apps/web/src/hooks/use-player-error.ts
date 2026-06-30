import { useCallback, useEffect, useMemo, useState } from "react";
import { bilibiliVariantCount } from "../lib/bilibili-manifest";
import { recordClientEvent } from "../lib/client-debug-log";
import { sanitizeVideoContext } from "../lib/debug-sanitize";
import { isIosDevice } from "../lib/ios-device";
import { detectProvider } from "../lib/provider";
import { isSignedHlsManifestUrl, resolveManifestSrc } from "../lib/stream-src";
import type { MediaSrc } from "../lib/vidstack";
import type { VideoStream } from "../types/stream";
import { useInstance } from "./use-instance";

type UsePlayerErrorReturn = {
  manifestSrc: MediaSrc;
  playerFailed: boolean;
  qualityFailed: boolean;
  handleError: () => void;
  reset: () => void;
  retryKey: number;
};

function normalizeLanguageTag(value: string | null): string {
  if (value === null || value.length === 0) return "";
  const [base] = value.toLowerCase().split("-");
  return base ?? "";
}

function hasMultipleAudioLanguages(stream: VideoStream): boolean {
  const languages = new Set<string>();
  for (const track of stream.audioStreams ?? []) {
    const language = normalizeLanguageTag(track.audioLocale);
    if (!language) continue;
    languages.add(language);
    if (languages.size > 1) return true;
  }
  return false;
}

function hasPlayableUrl(item: { deliveryMethod?: string; url: string }): boolean {
  return item.deliveryMethod !== "sabr" && item.url.length > 0;
}

export function usePlayerError(
  stream: VideoStream,
  isLive: boolean,
  enableHighQualityPlayback = false,
): UsePlayerErrorReturn {
  const streamId = stream.id;
  const debugVideo = sanitizeVideoContext(streamId) ?? "unknown";
  const provider = detectProvider(stream.id);
  const iosDevice = isIosDevice();
  const { data: instance } = useInstance();
  const preferServerManifests = instance?.guestAllowed !== false;
  const preferNativeManifest =
    preferServerManifests && !iosDevice && !hasMultipleAudioLanguages(stream);
  const legacyVideoOnlyCount = (stream.videoOnlyStreams ?? []).filter(hasPlayableUrl).length;
  const legacyAudioCount = (stream.audioStreams ?? []).filter(hasPlayableUrl).length;
  const legacyProgressiveCount = (stream.videoStreams ?? []).filter(hasPlayableUrl).length;
  const hasLegacyDashPair = legacyVideoOnlyCount > 0 && legacyAudioCount > 0;
  const highQualityEnabled =
    enableHighQualityPlayback &&
    !isLive &&
    !iosDevice &&
    preferServerManifests &&
    !stream.hlsUrl &&
    hasLegacyDashPair &&
    provider === "youtube";
  const nativeEnabled =
    preferServerManifests && !isLive && hasLegacyDashPair && preferNativeManifest;
  const hlsEnabled = Boolean(stream.hlsUrl && (isLive || isSignedHlsManifestUrl(stream.hlsUrl)));
  const hasYoutubeLegacyFallback = hlsEnabled || hasLegacyDashPair || legacyProgressiveCount > 0;
  const [hlsFailed, setHlsFailed] = useState(false);
  const [highQualityFailed, setHighQualityFailed] = useState(false);
  const [nativeFailed, setNativeFailed] = useState(false);
  const [qualityFailed, setQualityFailed] = useState(false);
  const [sabrFailed, setSabrFailed] = useState(false);
  const [compatibilityFallback, setCompatibilityFallback] = useState(false);
  const [bilibiliVariant, setBilibiliVariant] = useState(0);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const bilibiliVariants =
    provider === "bilibili"
      ? bilibiliVariantCount(stream.videoOnlyStreams ?? [], stream.audioStreams ?? [])
      : 0;

  const manifestSrc = useMemo(() => {
    if (compatibilityFallback) {
      return resolveManifestSrc(stream, isLive, nativeFailed, qualityFailed, {
        preferNativeManifest,
        compatibilityMode: true,
        enableHighQualityPlayback: highQualityEnabled,
        highQualityFailed,
        hlsFailed,
        allowServerManifests: preferServerManifests,
        bilibiliVariant,
        sabrFailed,
      });
    }
    return resolveManifestSrc(stream, isLive, nativeFailed, qualityFailed, {
      preferNativeManifest,
      enableHighQualityPlayback: highQualityEnabled,
      highQualityFailed,
      hlsFailed,
      allowServerManifests: preferServerManifests,
      bilibiliVariant,
      sabrFailed,
    });
  }, [
    stream,
    isLive,
    nativeFailed,
    qualityFailed,
    preferNativeManifest,
    compatibilityFallback,
    highQualityEnabled,
    highQualityFailed,
    hlsFailed,
    preferServerManifests,
    bilibiliVariant,
    sabrFailed,
  ]);

  const handleError = useCallback(() => {
    if (hlsEnabled && !hlsFailed) {
      recordClientEvent("player.hls_failed", { video: debugVideo });
      setHlsFailed(true);
      setRetryKey((k) => k + 1);
    } else if (provider === "bilibili" && bilibiliVariant < bilibiliVariants - 1) {
      recordClientEvent("player.bilibili_variant_failed", { video: debugVideo });
      setBilibiliVariant((variant) => variant + 1);
      setRetryKey((k) => k + 1);
    } else if (provider === "youtube" && !isLive && !sabrFailed) {
      recordClientEvent("player.sabr_failed", { video: debugVideo });
      setSabrFailed(true);
      if (hasYoutubeLegacyFallback) {
        setRetryKey((k) => k + 1);
      } else {
        setPlayerFailed(true);
      }
    } else if (highQualityEnabled && !highQualityFailed) {
      recordClientEvent("player.high_quality_failed", { video: debugVideo });
      setHighQualityFailed(true);
      setRetryKey((k) => k + 1);
    } else if (nativeEnabled && !nativeFailed) {
      recordClientEvent("player.native_manifest_failed", { video: debugVideo });
      setNativeFailed(true);
      setRetryKey((k) => k + 1);
    } else if (!qualityFailed) {
      recordClientEvent("player.quality_failed", { video: debugVideo });
      setQualityFailed(true);
      setRetryKey((k) => k + 1);
    } else if (!isLive && !compatibilityFallback) {
      recordClientEvent("player.compatibility_fallback", { video: debugVideo });
      setCompatibilityFallback(true);
      setRetryKey((k) => k + 1);
    } else {
      recordClientEvent("player.failed", { video: debugVideo });
      setPlayerFailed(true);
    }
  }, [
    debugVideo,
    hlsEnabled,
    hlsFailed,
    provider,
    bilibiliVariant,
    bilibiliVariants,
    highQualityEnabled,
    highQualityFailed,
    nativeEnabled,
    nativeFailed,
    qualityFailed,
    compatibilityFallback,
    isLive,
    sabrFailed,
    hasYoutubeLegacyFallback,
  ]);

  const reset = useCallback(() => {
    setHlsFailed(false);
    setHighQualityFailed(false);
    setNativeFailed(false);
    setQualityFailed(false);
    setSabrFailed(false);
    setCompatibilityFallback(false);
    setBilibiliVariant(0);
    setPlayerFailed(false);
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (streamId.length === 0) return;
    setHlsFailed(false);
    setHighQualityFailed(false);
    setNativeFailed(false);
    setQualityFailed(false);
    setSabrFailed(false);
    setCompatibilityFallback(false);
    setBilibiliVariant(0);
    setPlayerFailed(false);
    setRetryKey(0);
  }, [streamId]);

  return { manifestSrc, playerFailed, qualityFailed, handleError, reset, retryKey };
}
