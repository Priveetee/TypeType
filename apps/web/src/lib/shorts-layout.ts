export function shortsShellClasses(collapsed: boolean): string {
  const sidebar = collapsed ? "ml-14" : "ml-48";
  return `min-h-screen bg-zinc-950 text-zinc-100 pt-14 ${sidebar}`;
}

export function shortsViewportClasses(): string {
  return "h-[calc(100svh-3.5rem)] overflow-hidden";
}
