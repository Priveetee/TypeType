import type { MediaProviderAdapter } from "@vidstack/react";
import { isDASHProvider, Track, useMediaState } from "@vidstack/react";
import * as dashjs from "dashjs";

function shimDashjsQualityApi(player: dashjs.MediaPlayerClass): void {
  Reflect.set(
    player,
    "setQualityFor",
    (type: dashjs.MediaType, index: number, forceReplace = false) => {
      player.setRepresentationForTypeByIndex(type, index, forceReplace);
    },
  );
}

export function ChaptersTrack({ src }: { src: string }) {
  const duration = useMediaState("duration");
  if (!Number.isFinite(duration) || duration <= 0) return null;
  return <Track kind="chapters" src={src} default />;
}

export function onProviderChange(provider: MediaProviderAdapter | null) {
  if (!isDASHProvider(provider)) return;
  provider.library = dashjs.MediaPlayer;
  provider.onInstance((player) => {
    player.updateSettings({ streaming: { cmcd: { enabled: false } } });
    shimDashjsQualityApi(player);
  });
}
