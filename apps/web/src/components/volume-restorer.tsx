import { useMediaRemote, useMediaState } from "@vidstack/react";
import { useEffect, useRef } from "react";

type Props = {
  initialVolume: number;
  initialMuted: boolean;
  settingsReady: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
};

export function VolumeRestorer({
  initialVolume,
  initialMuted,
  settingsReady,
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
  }, [settingsReady, canPlay, remote, initialVolume, initialMuted]);

  useEffect(() => {
    if (!restoredRef.current) return;
    onVolumeChange?.(volume, muted);
  }, [volume, muted, onVolumeChange]);

  return null;
}
