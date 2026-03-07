const BASE = import.meta.env.VITE_API_URL;

export function proxyUrl(url: string): string {
  return `${BASE}/proxy?url=${encodeURIComponent(url)}`;
}
