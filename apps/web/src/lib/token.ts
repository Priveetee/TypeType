import { API_BASE as BASE } from "./env";

let cached: Promise<string> | null = null;

export function getToken(): Promise<string> {
  if (!cached) {
    cached = fetch(`${BASE}/token`)
      .then((res) => {
        if (!res.ok) throw new Error(`token fetch failed: ${res.status}`);
        return res.json() as Promise<{ token: string }>;
      })
      .then((body) => body.token)
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}

export function invalidateToken(): void {
  cached = null;
}
