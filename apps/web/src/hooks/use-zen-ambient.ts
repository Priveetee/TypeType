import { useCallback, useEffect, useRef, useState } from "react";

const ZEN_URL: string =
  "https://7145jo0azv.ufs.sh/f/pyEcI1anZvJ0Sth0RGo0LGMqC9F4HEaiwJNkhyRBfXxPZjIu";

export function useZenAmbient() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!ZEN_URL) {
      return;
    }
    const audio = new Audio(ZEN_URL);
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    audioRef.current?.play().catch(() => undefined);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, []);

  return { playing, start, toggle };
}
