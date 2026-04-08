export type DownloaderMode = "video" | "audio";

export type DownloaderJobStatus = "queued" | "running" | "done" | "failed";

export type DownloaderJobOptions = {
  mode: DownloaderMode;
  quality: string;
  format: string;
  sponsorBlock: boolean;
  sponsorBlockCategories: string[];
  thumbnailOnly: boolean;
  subtitles: {
    enabled: boolean;
    auto: boolean;
    embed: boolean;
    languages: string[];
    format: "srt" | "vtt";
  };
};

export type DownloaderCreateJobRequest = {
  url: string;
  options: DownloaderJobOptions;
};

export type DownloaderCreateJobResponse = {
  id: string;
  cached: boolean;
};

export type DownloaderJobResponse = {
  id: string;
  status: DownloaderJobStatus;
  artifactUrl?: string | null;
  error?: string | null;
};
