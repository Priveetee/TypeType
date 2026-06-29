import { useMediaRemote, useMediaState } from "../lib/vidstack";
import { AudioPauseIcon, AudioPlayIcon } from "./audio-control-icons";

export function AudioPlayButton() {
  const remote = useMediaRemote();
  const paused = useMediaState("paused");
  const Icon = paused ? AudioPlayIcon : AudioPauseIcon;
  const label = paused ? "Play" : "Pause";

  const togglePlayback = () => {
    if (paused) void Promise.resolve(remote.play()).catch(() => {});
    else void Promise.resolve(remote.pause()).catch(() => {});
  };

  return (
    <button
      type="button"
      className="typetype-audio-play-button"
      aria-label={label}
      title={label}
      onClick={togglePlayback}
    >
      <Icon size={32} />
    </button>
  );
}
