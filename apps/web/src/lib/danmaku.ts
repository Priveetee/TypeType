export const REGULAR_DISPLAY_MS = 6000;
const STATIC_DISPLAY_MS = 3000;
export const N_LANES = 8;
export const LANE_HEIGHT_PX = 36;
export const CHAR_WIDTH_PX = 14;

export function argbToColor(argb: number): string {
  const rgb = (argb >>> 0) & 0x00ffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

export function displayDuration(position: string): number {
  return position === "REGULAR" ? REGULAR_DISPLAY_MS : STATIC_DISPLAY_MS;
}
