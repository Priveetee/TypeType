import type { AudioStreamItem, VideoStreamItem } from "../types/api";
import { proxyUrl } from "./proxy";

const EXCLUDED_VIDEO_PREFIXES = ["av01", "vp9", "vp09"];

type ValidVideoStream = VideoStreamItem & { codec: string };
type ValidAudioStream = AudioStreamItem & { codec: string };

function isValidVideo(s: VideoStreamItem): s is ValidVideoStream {
  const codec = s.codec;
  if (codec === null || codec.length === 0) return false;
  return !EXCLUDED_VIDEO_PREFIXES.some((p) => codec.startsWith(p));
}

function isValidAudio(s: AudioStreamItem): s is ValidAudioStream {
  const codec = s.codec;
  return codec !== null && codec.length > 0;
}

function normalizeAudioCodec(codec: string): string {
  if (codec === "mp4a") return "mp4a.40.2";
  return codec;
}

function videoRepresentation(stream: ValidVideoStream, id: number): string {
  return (
    `<Representation id="v${id}" codecs="${stream.codec}"` +
    ` bandwidth="${stream.bitrate ?? 0}"` +
    ` width="${stream.width}" height="${stream.height}" frameRate="${stream.fps}">` +
    `<BaseURL>${proxyUrl(stream.url)}</BaseURL>` +
    `<SegmentBase indexRange="${stream.indexStart}-${stream.indexEnd}">` +
    `<Initialization range="${stream.initStart}-${stream.initEnd}"/>` +
    `</SegmentBase>` +
    `</Representation>`
  );
}

function audioRepresentation(stream: ValidAudioStream, id: number): string {
  const codec = normalizeAudioCodec(stream.codec);
  const bandwidth = (stream.bitrate ?? 0) * 1000;
  return (
    `<Representation id="a${id}" codecs="${codec}" bandwidth="${bandwidth}">` +
    `<AudioChannelConfiguration` +
    ` schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011"` +
    ` value="2"/>` +
    `<BaseURL>${proxyUrl(stream.url)}</BaseURL>` +
    `<SegmentBase indexRange="${stream.indexStart}-${stream.indexEnd}">` +
    `<Initialization range="${stream.initStart}-${stream.initEnd}"/>` +
    `</SegmentBase>` +
    `</Representation>`
  );
}

function adaptationSet(mimeType: string, representations: string[]): string {
  return (
    `<AdaptationSet mimeType="${mimeType}" startWithSAP="1" subsegmentAlignment="true">` +
    representations.join("") +
    `</AdaptationSet>`
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const group = map.get(k) ?? [];
    map.set(k, [...group, item]);
  }
  return map;
}

export function buildDashManifest(
  videoOnlyStreams: VideoStreamItem[],
  audioStreams: AudioStreamItem[],
  duration: number,
): string | null {
  if (duration <= 0) return null;

  const videos = videoOnlyStreams.filter(isValidVideo);
  const audios = audioStreams.filter(isValidAudio);

  if (videos.length === 0 || audios.length === 0) return null;

  const videoGroups = groupBy(videos, (s) => (s.mimeType || "video/mp4").split(";")[0].trim());
  const audioGroups = groupBy(audios, (s) => (s.mimeType || "audio/mp4").split(";")[0].trim());

  const sets: string[] = [];
  let vi = 0;
  for (const [mime, streams] of videoGroups) {
    sets.push(
      adaptationSet(
        mime,
        streams.map((s) => videoRepresentation(s, vi++)),
      ),
    );
  }
  let ai = 0;
  for (const [mime, streams] of audioGroups) {
    sets.push(
      adaptationSet(
        mime,
        streams.map((s) => audioRepresentation(s, ai++)),
      ),
    );
  }

  const mpd = [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<MPD xmlns="urn:mpeg:dash:schema:mpd:2011"`,
    ` profiles="urn:mpeg:dash:profile:full:2011"`,
    ` minBufferTime="PT1.5S" type="static"`,
    ` mediaPresentationDuration="PT${duration}S">`,
    `<Period>${sets.join("")}</Period>`,
    `</MPD>`,
  ].join("");

  return `data:application/dash+xml;base64,${btoa(mpd)}`;
}
