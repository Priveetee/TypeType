import type { SabrSourceConfig } from "../types/sabr";
import {
  appendChunks,
  bufferedAhead,
  type SabrTrackState,
  wait,
  waitForSourceOpen,
} from "./sabr-mse-utils";
import { fetchSabrSessionDescriptor, toWebSocketUrl } from "./sabr-session-api";
import {
  createSabrTrack,
  type SabrTrackName,
  sabrInitRequest,
  sabrSegmentRequest,
  setSabrTrackSequence,
} from "./sabr-track-state";
import { SabrWebSocketClient } from "./sabr-websocket-client";

type Args = {
  media: HTMLVideoElement;
  config: SabrSourceConfig;
  autoplay: boolean;
  onError: () => void;
};

const BUFFER_TARGET_SEC = 24;

export class SabrMseController {
  private readonly mediaSource = new MediaSource();
  private readonly objectUrl = URL.createObjectURL(this.mediaSource);
  private audio: SabrTrackState | null = null;
  private video: SabrTrackState | null = null;
  private client: SabrWebSocketClient | null = null;
  private generation = 0;
  private disposed = false;
  private failed = false;
  private readonly args: Args;

  constructor(args: Args) {
    this.args = args;
  }

  start(): void {
    this.args.media.src = this.objectUrl;
    this.args.media.addEventListener("seeking", this.handleSeeking);
    this.args.media.addEventListener("error", this.handleMediaError);
    void this.initialize();
  }

  dispose(): void {
    this.disposed = true;
    this.generation += 1;
    this.client?.close();
    this.args.media.removeEventListener("seeking", this.handleSeeking);
    this.args.media.removeEventListener("error", this.handleMediaError);
    this.audio?.queue.clear();
    this.video?.queue.clear();
    this.args.media.removeAttribute("src");
    this.args.media.load();
    URL.revokeObjectURL(this.objectUrl);
  }

  private async initialize(): Promise<void> {
    const generation = this.generation;
    try {
      if (typeof MediaSource === "undefined") throw new Error("mse_unavailable");
      await waitForSourceOpen(this.mediaSource);
      if (!this.active(generation)) return;
      const descriptor = await fetchSabrSessionDescriptor(this.args.config.descriptorUrl);
      if (!this.active(generation)) return;
      if (!MediaSource.isTypeSupported(descriptor.video.mimeType))
        throw new Error("video_unsupported");
      if (!MediaSource.isTypeSupported(descriptor.audio.mimeType))
        throw new Error("audio_unsupported");
      this.mediaSource.duration = descriptor.durationMs / 1000;
      const currentTimeMs = this.args.media.currentTime * 1000;
      this.video = createSabrTrack(this.mediaSource, descriptor.video, currentTimeMs);
      this.audio = createSabrTrack(this.mediaSource, descriptor.audio, currentTimeMs);
      this.client = new SabrWebSocketClient(toWebSocketUrl(descriptor.endpoints.webSocket));
      await this.client.connect();
      if (!this.active(generation)) return;
      await this.appendInit("video", generation);
      await this.appendInit("audio", generation);
      void this.pump(generation);
    } catch {
      this.fail();
    }
  }

  private async appendInit(trackName: SabrTrackName, generation: number): Promise<void> {
    const track = this.track(trackName);
    const client = this.client;
    if (!track || !client) return;
    const currentTimeMs = Math.round(this.args.media.currentTime * 1000);
    const chunks = await client.request(
      sabrInitRequest(trackName, track, generation, currentTimeMs),
    );
    if (!this.active(generation)) return;
    appendChunks(track, chunks);
  }

  private async pump(generation: number): Promise<void> {
    while (!this.disposed && generation === this.generation) {
      try {
        if (bufferedAhead(this.args.media) >= BUFFER_TARGET_SEC) {
          await wait(400);
          continue;
        }
        await this.appendSegment("video", generation);
        await this.appendSegment("audio", generation);
        if (this.args.autoplay && this.args.media.paused && bufferedAhead(this.args.media) > 1) {
          await this.args.media.play().catch(() => undefined);
        }
        await wait(20);
      } catch {
        if (generation === this.generation) this.fail();
        return;
      }
    }
  }

  private async appendSegment(trackName: SabrTrackName, generation: number): Promise<void> {
    const track = this.track(trackName);
    const client = this.client;
    if (!track || !client || track.nextSequence > track.format.endSegment) return;
    const currentTimeMs = Math.round(this.args.media.currentTime * 1000);
    const chunks = await client.request(
      sabrSegmentRequest(trackName, track, generation, currentTimeMs),
    );
    if (!this.active(generation)) return;
    appendChunks(track, chunks);
    track.queue.removeBefore(this.args.media.currentTime);
  }

  private readonly handleSeeking = (): void => {
    if (this.disposed || this.failed) return;
    this.generation += 1;
    const timeMs = this.args.media.currentTime * 1000;
    if (this.video) setSabrTrackSequence(this.video, timeMs);
    if (this.audio) setSabrTrackSequence(this.audio, timeMs);
    this.video?.queue.clear();
    this.audio?.queue.clear();
    this.client?.close();
    this.client = null;
    void this.reconnect(this.generation);
  };

  private async reconnect(generation: number): Promise<void> {
    try {
      const descriptor = await fetchSabrSessionDescriptor(this.args.config.descriptorUrl);
      if (!this.active(generation)) return;
      this.client = new SabrWebSocketClient(toWebSocketUrl(descriptor.endpoints.webSocket));
      await this.client.connect();
      if (!this.active(generation)) return;
      void this.pump(generation);
    } catch {
      if (generation === this.generation) this.fail();
    }
  }

  private readonly handleMediaError = (): void => this.fail();

  private track(name: SabrTrackName): SabrTrackState | null {
    return name === "audio" ? this.audio : this.video;
  }

  private active(generation: number): boolean {
    return !this.disposed && generation === this.generation;
  }

  private fail(): void {
    if (this.disposed || this.failed) return;
    this.failed = true;
    this.client?.close();
    this.args.onError();
  }
}
