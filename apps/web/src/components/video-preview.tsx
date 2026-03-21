import { useEffect, useRef } from "react";
import { buildDashManifest } from "../lib/dash-manifest";
import { API_BASE } from "../lib/env";
import { proxyDashManifest } from "../lib/proxy";
import type { VideoStream } from "../types/stream";

type Props = {
  stream: VideoStream | undefined;
  show: boolean;
};

export function VideoPreview({ stream, show }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashRef = useRef<DashJs | null>(null);

  useEffect(() => {
    if (!show || !stream || !videoRef.current) return;

    const video = videoRef.current;
    const src = resolvePreviewSrc(stream);
    if (!src) return;

    let cleanup = () => {};

    if (src.type === "application/x-mpegurl") {
      void loadHls(video, src.url).then((hls) => {
        hlsRef.current = hls;
        cleanup = () => hls?.destroy();
      });
    } else if (src.type === "application/dash+xml") {
      void loadDash(video, src.url).then((player) => {
        dashRef.current = player;
        cleanup = () => player?.destroy();
      });
    }

    return () => {
      cleanup();
      hlsRef.current = null;
      dashRef.current = null;
    };
  }, [show, stream]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (show) {
      void videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [show]);

  if (!show || !stream) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      playsInline
      loop
    />
  );
}

type PreviewSrc = { url: string; type: "application/x-mpegurl" | "application/dash+xml" } | null;

function resolvePreviewSrc(stream: VideoStream): PreviewSrc {
  if (stream.hlsUrl) {
    return {
      url: proxyDashManifest(
        `${API_BASE}/streams/hls-manifest?url=${encodeURIComponent(stream.id)}`,
      ),
      type: "application/x-mpegurl",
    };
  }

  if (stream.videoOnlyStreams?.length && stream.audioStreams?.length) {
    const manifest = buildDashManifest(
      stream.videoOnlyStreams,
      stream.audioStreams,
      stream.duration,
      480,
    );
    if (manifest) return { url: manifest, type: "application/dash+xml" };
  }

  return {
    url: proxyDashManifest(
      `${API_BASE}/streams/native-manifest?url=${encodeURIComponent(stream.id)}`,
    ),
    type: "application/dash+xml",
  };
}

type Hls = { destroy: () => void };
type DashJs = { destroy: () => void };

async function loadHls(video: HTMLVideoElement, url: string): Promise<Hls | null> {
  if (!supportsNativeHls(video)) return null;
  video.src = url;
  return {
    destroy: () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    },
  };
}

function supportsNativeHls(video: HTMLVideoElement): boolean {
  const appleType = video.canPlayType("application/vnd.apple.mpegurl");
  const legacyType = video.canPlayType("application/x-mpegURL");
  return appleType !== "" || legacyType !== "";
}

async function loadDash(video: HTMLVideoElement, url: string): Promise<DashJs | null> {
  const dashjs = await import("dashjs");
  const player = dashjs.MediaPlayer().create();
  player.updateSettings({
    streaming: {
      buffer: { fastSwitchEnabled: true, bufferTimeAtTopQuality: 10 },
      abr: { initialBitrate: { video: 1000 }, maxBitrate: { video: 2000 } },
    },
  });
  player.initialize(video, url, false);
  return player;
}
