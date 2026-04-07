function isTouchMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || isTouchMac();
}
