import type { AudioStreamItem, VideoStreamItem } from "../types/api";

const RESOLUTION_BANDWIDTH: Record<string, number> = {
  "1080p": 4000000,
  "720p": 2000000,
  "480p": 1000000,
  "360p": 500000,
  "240p": 300000,
};

function extractDomandBid(url: string): { cleanUrl: string; domandBid: string | null } {
  const hashIdx = url.indexOf("#");
  if (hashIdx === -1) return { cleanUrl: url, domandBid: null };
  const cleanUrl = url.slice(0, hashIdx);
  const fragment = url.slice(hashIdx + 1);
  const params = new URLSearchParams(fragment);
  const cookie = params.get("cookie");
  if (!cookie) return { cleanUrl, domandBid: null };
  const match = cookie.match(/domand_bid=([^&]+)/);
  return { cleanUrl, domandBid: match ? match[1] : null };
}

function nicoProxyUrl(rawUrl: string, origin: string): string {
  const { cleanUrl, domandBid } = extractDomandBid(rawUrl);
  const base = `${origin}/proxy/nicovideo?url=${encodeURIComponent(cleanUrl)}`;
  return domandBid ? `${base}&domand_bid=${encodeURIComponent(domandBid)}` : base;
}

export function buildNicoMasterPlaylist(
  videoStreams: VideoStreamItem[],
  audioStreams: AudioStreamItem[],
  origin: string,
): string | null {
  if (videoStreams.length === 0 || audioStreams.length === 0) return null;

  const audio = audioStreams[0];
  const audioUri = nicoProxyUrl(audio.url, origin);

  const lines: string[] = ["#EXTM3U"];
  lines.push(
    `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="default",DEFAULT=YES,URI="${audioUri}"`,
  );

  for (const v of videoStreams) {
    const bw = RESOLUTION_BANDWIDTH[v.resolution ?? ""] ?? 1000000;
    lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${bw},AUDIO="audio"`);
    lines.push(nicoProxyUrl(v.url, origin));
  }

  const playlist = `${lines.join("\n")}\n`;
  return `data:application/vnd.apple.mpegurl;base64,${btoa(playlist)}`;
}
