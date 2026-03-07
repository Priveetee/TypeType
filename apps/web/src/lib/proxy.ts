const RAW: string = import.meta.env.VITE_API_URL;

function absoluteBase(): string {
  if (RAW.startsWith("http")) return RAW;
  return window.location.origin + RAW;
}

export function proxyUrl(url: string): string {
  return `${absoluteBase()}/proxy?url=${encodeURIComponent(url)}`;
}
