import type { VideoStream } from "../types/stream";

export type DownloadMode = "video" | "audio";

export type DownloadOption = {
  id: string;
  mode: DownloadMode;
  label: string;
  detail: string;
  size: string;
  sourceUrl: string;
  recommended: boolean;
  height?: number;
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
        sourceUrl: item.url,
        recommended: item.height === 720,
        height: item.height,
      };
    });

  const audios = [...(stream.audioStreams ?? [])]
    .sort((left, right) => (right.bitrate ?? 0) - (left.bitrate ?? 0))
    .map((item, index) => {
      const bitrate = item.bitrate ? `${Math.round(item.bitrate / 1000)} kbps` : "Audio";
      const locale = item.audioLocale || item.quality || "default";
      const codec = item.codec ?? "audio";
      const container = parseContainer(item.mimeType);
      return {
        id: `audio-${item.itag}-${index}`,
        mode: "audio" as const,
        label: `${bitrate} ${container}`,
        detail: `${locale} · ${codec} · itag ${item.itag}`,
        size: formatBytes(item.contentLength),
        sourceUrl: item.url,
        recommended: bitrate.includes("160") || bitrate.includes("192"),
      };
    });

  const merged = [...videos, ...audios];
  if (merged.some((option) => option.recommended)) return merged;
  if (videos.length > 0) videos[0] = { ...videos[0], recommended: true };
  else if (audios.length > 0) audios[0] = { ...audios[0], recommended: true };
  return [...videos, ...audios];
}
