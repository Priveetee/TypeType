function parseUrl(value: string): URL | null {
  const trimmed = value.trim().replace(/^<|>$/g, "");
  if (trimmed.length === 0) return null;
  try {
    return new URL(trimmed);
  } catch {
    try {
      return new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }
}

function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function isSupportedHost(host: string): boolean {
  if (host === "youtu.be") return true;
  if (hostMatches(host, "youtube.com")) return true;
  if (host === "nico.ms") return true;
  if (hostMatches(host, "nicovideo.jp")) return true;
  if (host === "b23.tv") return true;
  if (hostMatches(host, "bilibili.com")) return true;
  return false;
}

export function toDirectWatchUrl(value: string): string | null {
  const parsed = parseUrl(value);
  if (!parsed) return null;
  const host = parsed.hostname.toLowerCase();
  if (!isSupportedHost(host)) return null;
  return `${parsed.origin}${parsed.pathname}${parsed.search}`;
}
