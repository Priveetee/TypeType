import { useMediaRemote, useMediaState } from "../lib/vidstack";

export function AudioCenterToggle() {
  const remote = useMediaRemote();
  const paused = useMediaState("paused");
  const label = paused ? "Play audio" : "Pause audio";

  const togglePlayback = () => {
    if (paused) void Promise.resolve(remote.play()).catch(() => {});
    else void Promise.resolve(remote.pause()).catch(() => {});
  };

  return (
    <button
      type="button"
      className="typetype-audio-center-toggle"
      aria-label={label}
      onClick={togglePlayback}
    />
  );
}
