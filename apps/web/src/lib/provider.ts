export type Provider = "youtube" | "nicovideo" | "bilibili" | "unknown";

export function detectProvider(url: string): Provider {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("nicovideo.jp")) return "nicovideo";
  if (url.includes("bilibili.com")) return "bilibili";
  return "unknown";
}

export function hasDanmaku(provider: Provider): boolean {
  return provider === "nicovideo" || provider === "bilibili";
}
