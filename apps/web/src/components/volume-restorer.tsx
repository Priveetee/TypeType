import { useEffect, useRef } from "react";
import { useMediaRemote, useMediaState } from "../lib/vidstack";

type Props = {
  initialVolume: number;
  initialMuted: boolean;
  settingsReady: boolean;
  autoplay: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
};

export function VolumeRestorer({
  initialVolume,
  initialMuted,
  settingsReady,
  autoplay,
  onVolumeChange,
}: Props) {
  const remote = useMediaRemote();
  const volume = useMediaState("volume");
  const muted = useMediaState("muted");
  const canPlay = useMediaState("canPlay");
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!settingsReady || !canPlay || restoredRef.current) return;
    restoredRef.current = true;
    remote.changeVolume(initialVolume);
    if (initialMuted) remote.mute();
    if (autoplay) remote.play();
  }, [settingsReady, canPlay, remote, initialVolume, initialMuted, autoplay]);

  useEffect(() => {
    if (!restoredRef.current) return;
    onVolumeChange?.(volume, muted);
  }, [volume, muted, onVolumeChange]);

  return null;
}
