import type { DownloaderCreateJobRequest, DownloaderMode } from "../types/downloader";
import type { VideoStream } from "../types/stream";

export type DownloadMode = "video" | "audio";

export type DownloadOption = {
  id: string;
  mode: DownloadMode;
  label: string;
  detail: string;
  size: string;
  recommended: boolean;
  height?: number;
  bitrate?: number;
  format: string;
  qualityHint: string;
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function parseContainer(mimeType: string): string {
  const [type] = mimeType.split(";");
  const [, container = "bin"] = type.split("/");
  return container.toUpperCase();
}

function pickVideoQuality(height: number): string {
  if (height >= 1080) return "best";
  if (height >= 720) return "balanced";
  return "small";
}

function pickAudioQuality(bitrate: number): string {
  if (bitrate >= 192_000) return "best";
  if (bitrate >= 128_000) return "balanced";
  return "small";
}

export function buildDownloadOptions(stream: VideoStream): DownloadOption[] {
  const videos = [...(stream.videoOnlyStreams ?? [])]
    .sort((left, right) => right.height - left.height || right.fps - left.fps)
    .map((item, index) => {
      const resolution = item.resolution || (item.height > 0 ? `${item.height}p` : "Video");
      const fps = item.fps > 0 ? ` ${item.fps}fps` : "";
      const codec = item.codec ?? "video";
      const container = parseContainer(item.mimeType);
      return {
        id: `video-${item.itag}-${index}`,
        mode: "video" as const,
        label: `${resolution}${fps} ${container}`,
        detail: `${codec} · itag ${item.itag}`,
        size: formatBytes(item.contentLength),
        recommended: item.height === 720,
        height: item.height,
        format: container.toLowerCase(),
        qualityHint: pickVideoQuality(item.height),
      };
    });

  const audios = [...(stream.audioStreams ?? [])]
    .sort((left, right) => (right.bitrate ?? 0) - (left.bitrate ?? 0))
    .map((item, index) => {
      const locale = item.audioLocale || item.quality || "default";
      const codec = item.codec ?? "audio";
      const container = parseContainer(item.mimeType);
      const bitrate = item.bitrate ?? 0;
      return {
        id: `audio-${item.itag}-${index}`,
        mode: "audio" as const,
        label: `${item.bitrate ? `${Math.round(item.bitrate / 1000)} kbps` : "Audio"} ${container}`,
        detail: `${locale} · ${codec} · itag ${item.itag}`,
        size: formatBytes(item.contentLength),
        recommended: bitrate >= 160_000 && bitrate < 256_000,
        bitrate,
        format: container.toLowerCase(),
        qualityHint: pickAudioQuality(bitrate),
      };
    });

  const merged = [...videos, ...audios];
  if (merged.some((option) => option.recommended)) return merged;
  if (videos.length > 0) videos[0] = { ...videos[0], recommended: true };
  else if (audios.length > 0) audios[0] = { ...audios[0], recommended: true };
  return [...videos, ...audios];
}

export function buildDownloaderCreatePayload(
  videoUrl: string,
  option: DownloadOption,
): DownloaderCreateJobRequest {
  const mode = option.mode as DownloaderMode;
  const format = option.format.length > 0 ? option.format : mode === "video" ? "mp4" : "mp3";
  return {
    url: videoUrl,
    options: {
      mode,
      quality: option.qualityHint,
      format,
      sponsorBlock: false,
      sponsorBlockCategories: ["sponsor", "intro"],
      thumbnailOnly: false,
      subtitles: {
        enabled: false,
        auto: false,
        embed: false,
        languages: ["en"],
        format: "srt",
      },
    },
  };
}
