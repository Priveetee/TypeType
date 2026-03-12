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
  if (!url) return url;
  const normalized = url.startsWith("httpss://") ? `https://${url.slice(9)}` : url;
  if (!isBiliBiliCdn(normalized)) return normalized;
  return proxyUrl(normalized);
}

export function toProxiedVttUrl(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set("fmt", "vtt");
  return proxyUrl(parsed.toString());
}
