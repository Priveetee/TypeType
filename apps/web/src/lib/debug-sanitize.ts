function trimText(value: string): string {
  const collapsed = value.replace(/\s+/g, " ").trim();
  if (collapsed.length <= 420) return collapsed;
  return `${collapsed.slice(0, 417)}...`;
}

function stripQueryAndHash(value: string): string {
  const qIndex = value.indexOf("?");
  const hIndex = value.indexOf("#");
  const cutIndex = qIndex < 0 ? hIndex : hIndex < 0 ? qIndex : Math.min(qIndex, hIndex);
  if (cutIndex < 0) return value;
  return value.slice(0, cutIndex);
}

function sanitizeAbsoluteUrlToken(token: string): string {
  try {
    const parsed = new URL(token);
    const path = stripQueryAndHash(parsed.pathname || "/");
    return path.length > 0 ? path : "/";
  } catch {
    return "<redacted-url>";
  }
}

export function sanitizeDebugText(value: string): string {
  const withoutAbsoluteUrls = value.replace(/https?:\/\/[^\s"'`<>\])]+/gi, (token) =>
    sanitizeAbsoluteUrlToken(token),
  );
  const withoutLocalhost = withoutAbsoluteUrls.replace(
    /\blocalhost(?::\d{1,5})?\b/gi,
    "<redacted-host>",
  );
  const withoutIp = withoutLocalhost.replace(
    /\b(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?\b/g,
    "<redacted-host>",
  );
  const withoutDomains = withoutIp.replace(
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?\b/gi,
    "<redacted-host>",
  );
  return trimText(withoutDomains);
}

export function sanitizeRequestPath(value: string): string {
  if (value.length === 0) return "/";
  try {
    const parsed = new URL(value);
    return stripQueryAndHash(parsed.pathname || "/");
  } catch {
    const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
    return sanitizeDebugText(stripQueryAndHash(withLeadingSlash));
  }
}

export function sanitizeVideoContext(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;
  try {
    const parsed = new URL(videoUrl);
    const host = parsed.hostname.toLowerCase();
    const videoId = parsed.searchParams.get("v");
    if (videoId && host.includes("youtube")) return `youtube:${sanitizeDebugText(videoId)}`;
    if (host === "youtu.be")
      return `youtube:${sanitizeDebugText(parsed.pathname.replace("/", ""))}`;
    const parts = parsed.pathname.split("/").filter((part) => part.length > 0);
    const last = parts.length > 0 ? parts[parts.length - 1] : "";
    if (host.includes("youtube") && parts.includes("shorts") && last.length > 0) {
      return `youtube:${sanitizeDebugText(last)}`;
    }
    if (host.includes("nicovideo") && last.length > 0) {
      return `nicovideo:${sanitizeDebugText(last)}`;
    }
    return sanitizeRequestPath(parsed.pathname || "/");
  } catch {
    return sanitizeDebugText(videoUrl);
  }
}
