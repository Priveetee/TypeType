import type { PreviewFrameItem } from "../types/api";

function formatVttTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

export function buildThumbnailVtt(frames: PreviewFrameItem[]): string | null {
  if (frames.length === 0) return null;

  const lines: string[] = ["WEBVTT", ""];

  let globalIndex = 0;
  let currentTimeMs = 0;

  for (const frame of frames) {
    const { urls, frameWidth, frameHeight, framesPerPageX, framesPerPageY, durationPerFrame } =
      frame;

    for (const url of urls) {
      const framesOnSheet = framesPerPageX * framesPerPageY;
      for (let i = 0; i < framesOnSheet; i++) {
        const col = i % framesPerPageX;
        const row = Math.floor(i / framesPerPageX);
        const x = col * frameWidth;
        const y = row * frameHeight;
        const startMs = currentTimeMs;
        const endMs = currentTimeMs + durationPerFrame;
        lines.push(String(globalIndex + 1));
        lines.push(`${formatVttTime(startMs)} --> ${formatVttTime(endMs)}`);
        lines.push(`${url}#xywh=${x},${y},${frameWidth},${frameHeight}`);
        lines.push("");
        currentTimeMs = endMs;
        globalIndex++;
      }
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/vtt" });
  return URL.createObjectURL(blob);
}
