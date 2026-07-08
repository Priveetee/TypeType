class TypeTypeHttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TypeTypeHttpError";
  }
}

export type HttpClientOptions = {
  endpoint: string;
  headers?: HeadersInit;
};

export class HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  async json(path: string, init?: RequestInit): Promise<unknown> {
    const response = await this.fetch(path, init);
    return response.json();
  }

  async text(url: string, init?: RequestInit): Promise<string> {
    const response = await this.fetchAbsolute(url, init);
    return response.text();
  }

  async bytes(url: string, init?: RequestInit): Promise<ArrayBuffer> {
    const response = await this.fetchAbsolute(url, init);
    return response.arrayBuffer();
  }

  response(url: string, init?: RequestInit): Promise<Response> {
    return this.fetchRaw(url, init);
  }

  absolute(path: string): string {
    return new URL(path.replace(/^\/+/, ""), this.normalizedEndpoint()).href;
  }

  private fetch(path: string, init?: RequestInit): Promise<Response> {
    return this.fetchAbsolute(this.absolute(path), init);
  }

  private async fetchAbsolute(url: string, init?: RequestInit): Promise<Response> {
    const response = await this.fetchRaw(url, init);
    if (!response.ok) throw new TypeTypeHttpError(response.statusText, response.status);
    return response;
  }

  private async fetchRaw(url: string, init?: RequestInit): Promise<Response> {
    const headers = new Headers(this.options.headers);
    new Headers(init?.headers).forEach((value, key) => {
      headers.set(key, value);
    });
    return fetch(url, { ...init, headers, cache: init?.cache ?? "no-store" });
  }

  private normalizedEndpoint(): string {
    return this.options.endpoint.endsWith("/")
      ? this.options.endpoint
      : `${this.options.endpoint}/`;
  }
}
