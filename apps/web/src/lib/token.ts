const BASE = import.meta.env.VITE_API_URL;

let cached: Promise<string> | null = null;

export function getToken(): Promise<string> {
  if (!cached) {
    cached = fetch(`${BASE}/token`)
      .then((res) => res.json() as Promise<{ token: string }>)
      .then((body) => body.token);
  }
  return cached;
}
