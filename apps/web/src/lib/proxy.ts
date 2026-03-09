const RAW: string = import.meta.env.VITE_API_URL;

function absoluteBase(): string {
  if (RAW.startsWith("http")) return RAW;
  return window.location.origin + RAW;
}

export function proxyUrl(url: string): string {
  return `${absoluteBase()}/proxy?url=${encodeURIComponent(url)}`;
}

function isBiliBiliCdn(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return parsed.hostname.endsWith("hdslb.com");
  } catch {
    return false;
  }
}

export function proxyImage(url: string): string {
  if (!url || !isBiliBiliCdn(url)) return url;
  return proxyUrl(url);
}
