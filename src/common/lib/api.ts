export interface ApiConfig {
  host?: string;
  protocol?: string;
  port?: string | number;
  timeout?: number;
  logging?: boolean;
  logger?: Function;
  network?: string;
}

export interface ResponseWithData<T = any> extends Response {
  data: T;
}

export default class Api {
  public readonly METHOD_GET = "GET";
  public readonly METHOD_POST = "POST";

  public config!: ApiConfig;

  constructor(config: ApiConfig) {
    this.applyConfig(config);
  }

  public applyConfig(config: ApiConfig) {
    this.config = this.mergeDefaults(config);
  }

  public getConfig() {
    return this.config;
  }

  private mergeDefaults(config: ApiConfig): ApiConfig {
    const protocol = config.protocol || "http";
    const port = config.port || (protocol === "https" ? 443 : 80);

    return {
      host: config.host || "127.0.0.1",
      protocol,
      port,
      timeout: config.timeout || 20000,
      logging: config.logging || false,
      logger: config.logger || console.log,
      network: config.network,
    };
  }

  public async get<T = any>(
    endpoint: string,
    config?: RequestInit
  ): Promise<ResponseWithData<T>> {
    return await this.request(
      endpoint,
      { ...config, method: this.METHOD_GET }
    );
  }

  public async post<T = any>(
    endpoint: string,
    body: any,
    config?: RequestInit
  ): Promise<ResponseWithData<T>> {
    const headers = new Headers(config?.headers || {});

    headers.append("content-type", "application/json");
    headers.append("accept", "application/json, text/plain, */*");

    return await this.request(
      endpoint,
      {
        ...config,
        method: this.METHOD_POST,
        body: JSON.stringify(body),
        headers
      }
    );
  }

  public async request<T = unknown>(endpoint: string, init?: RequestInit): Promise<ResponseWithData<T>> {
    const headers = new Headers(init?.headers || {});
    const baseURL = `${this.config.protocol}://${this.config.host}:${this.config.port}`;

    if (endpoint.startsWith("/")) {
      endpoint = endpoint.replace("/", "")
    }

    if (this.config.network) {
      headers.append("x-network", this.config.network);
    }

    if (this.config.logging) {
      this.config.logger!(`Requesting: ${baseURL}/${endpoint}`);
    }

    let res = await fetch(
      `${baseURL}/${endpoint}`,
      {
        ...(init || {}),
        headers
      }
    );

    if (this.config.logging) {
      this.config.logger!(
        `Response:   ${res.url} - ${res.status}`
      );
    }

    const contentType = res.headers.get("content-type");
    const response: Partial<ResponseWithData<T>> = res;

    if (contentType?.startsWith("application/json")) {
      response.data = await res.clone().json() as T;
    } else {
      try {
        response.data = await res.clone().text() as T;
      } catch {
        response.data = await res.clone().arrayBuffer() as T;
      }
    }
    
    return response as ResponseWithData<T>;
  }
}
