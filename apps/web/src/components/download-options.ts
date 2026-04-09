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
  videoItag?: string;
  audioItag?: string;
  width?: number;
  height?: number;
  fps?: number;
  videoCodec?: string;
  audioCodec?: string;
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

function effectiveVideoHeight(height?: number, width?: number): number {
  if (typeof height !== "number" || height <= 0) return 0;
  if (typeof width !== "number" || width <= 0) return height;
  return Math.min(height, width);
}

function pickVideoQuality(height: number, width?: number): string {
  const effective = effectiveVideoHeight(height, width);
  if (effective >= 1080) return "best";
  if (effective >= 720) return "balanced";
  return "small";
}

function pickAudioQuality(bitrate: number): string {
  if (bitrate >= 192_000) return "best";
  if (bitrate >= 128_000) return "balanced";
  return "small";
}

function pickRecommendedVideoIndex(videos: DownloadOption[]): number {
  const fullHd = videos.findIndex(
    (video) => effectiveVideoHeight(video.height, video.width) === 1080,
  );
  if (fullHd >= 0) return fullHd;
  const hd = videos.findIndex((video) => effectiveVideoHeight(video.height, video.width) === 720);
  if (hd >= 0) return hd;
  const belowFullHd = videos.findIndex(
    (video) => effectiveVideoHeight(video.height, video.width) < 1080,
  );
  if (belowFullHd >= 0) return belowFullHd;
  return videos.length - 1;
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
        recommended: false,
        videoItag: String(item.itag),
        width: item.width,
        height: item.height,
        fps: item.fps,
        videoCodec: item.codec ?? undefined,
        format: container.toLowerCase(),
        qualityHint: pickVideoQuality(item.height, item.width),
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
        recommended: false,
        audioItag: String(item.itag),
        bitrate,
        audioCodec: item.codec ?? undefined,
        format: container.toLowerCase(),
        qualityHint: pickAudioQuality(bitrate),
      };
    });

  if (videos.length > 0) {
    const recommendedIndex = pickRecommendedVideoIndex(videos);
    videos[recommendedIndex] = { ...videos[recommendedIndex], recommended: true };
  }

  if (audios.length > 0) {
    const recommendedAudio = audios.findIndex(
      (audio) => (audio.bitrate ?? 0) >= 160_000 && (audio.bitrate ?? 0) < 256_000,
    );
    const index = recommendedAudio >= 0 ? recommendedAudio : 0;
    audios[index] = { ...audios[index], recommended: true };
  }

  const merged = [...videos, ...audios];
  return merged;
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
      videoItag: option.videoItag,
      audioItag: option.audioItag,
      height: option.height,
      fps: option.fps,
      videoCodec: option.videoCodec,
      audioCodec: option.audioCodec,
      bitrate: option.bitrate,
      allowQualityFallback: false,
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
