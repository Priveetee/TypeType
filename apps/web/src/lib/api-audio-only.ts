import { useAuthStore } from "../stores/auth-store";
import { ApiError, request } from "./api";
import { API_BASE as BASE, toApiUrl } from "./env";
import type { MediaSrc } from "./vidstack";

export type AudioOnlyResponse = {
  src: string;
  mimeType: string;
  codec: string;
  bitrate: number | null;
  contentLength: number | null;
  duration: number | null;
};

function audioOnlyInit(): RequestInit {
  const token = useAuthStore.getState().token;
  if (!token) return { cache: "no-store" };
  return {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  };
}

export function fetchAudioOnlyStream(
  url: string,
  preferOriginal: boolean,
  preferredLocale: string,
): Promise<AudioOnlyResponse> {
  const params = new URLSearchParams({
    url,
    preferOriginal: String(preferOriginal),
    preferredLocale,
  });
  return request<AudioOnlyResponse>(`${BASE}/streams/audio-only?${params}`, audioOnlyInit());
}

export function toAudioOnlyMediaSrc(response: AudioOnlyResponse): MediaSrc {
  return {
    src: toApiUrl(response.src),
    type: response.mimeType.includes("webm") ? "audio/webm" : "audio/mp3",
  };
}

export function isAudioOnlyUnavailable(error: unknown): boolean {
  return error instanceof ApiError && error.status === 422;
}
