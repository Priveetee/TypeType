export type PlaybackMode = "adaptive" | "ios-legacy-compat";

const STORAGE_KEY = "typed-playback-mode";
const CHANGE_EVENT = "typed:playback-mode-change";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isPlaybackMode(value: string | null): value is PlaybackMode {
  return value === "adaptive" || value === "ios-legacy-compat";
}

export function readPlaybackMode(): PlaybackMode {
  if (!canUseStorage()) return "adaptive";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isPlaybackMode(stored) ? stored : "adaptive";
}

export function writePlaybackMode(mode: PlaybackMode): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setPlaybackMode(mode: PlaybackMode): void {
  writePlaybackMode(mode);
}

export function subscribePlaybackMode(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    listener();
  };
  const onChange = () => listener();

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function isCompatibilityPlaybackMode(): boolean {
  return readPlaybackMode() === "ios-legacy-compat";
}
