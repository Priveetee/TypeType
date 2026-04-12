const HTTP_PREFIX = "http://";
const HTTPS_PREFIX = "https://";

function trimTrailingSlash(value: string): string {
  const trimmed = value.trim();
  return trimmed.endsWith("/") ? trimmed.replace(/\/+$/, "") : trimmed;
}

export function normalizeChannelUrl(channelUrl: string): string {
  const base = trimTrailingSlash(channelUrl);
  try {
    const parsed = new URL(base);
    const protocol =
      parsed.protocol === "http:" || parsed.protocol === "https:" ? "https:" : parsed.protocol;
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${protocol}//${parsed.host.toLowerCase()}${path}`;
  } catch {
    return base;
  }
}

export function channelUrlVariants(channelUrl: string): string[] {
  const normalized = normalizeChannelUrl(channelUrl);
  const variants = new Set<string>([trimTrailingSlash(channelUrl), normalized]);
  if (normalized.startsWith(HTTPS_PREFIX)) {
    variants.add(`${HTTP_PREFIX}${normalized.slice(HTTPS_PREFIX.length)}`);
  }
  if (normalized.startsWith(HTTP_PREFIX)) {
    variants.add(`${HTTPS_PREFIX}${normalized.slice(HTTP_PREFIX.length)}`);
  }
  return [...variants];
}
