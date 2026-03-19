import type { RedirectTarget } from "./auth-routes";

export function goto(path: RedirectTarget): void {
  if (window.location.pathname === path) return;
  window.location.assign(path);
}
