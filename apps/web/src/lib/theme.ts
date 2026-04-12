import type { AppTheme } from "../stores/theme-store";

const DARK_THEME_COLOR = "#09090b";
const LIGHT_THEME_COLOR = "#f4f4f5";

function themeColor(theme: AppTheme): string {
  return theme === "light" ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;
}

export function applyTheme(theme: AppTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", themeColor(theme));
  }
}
