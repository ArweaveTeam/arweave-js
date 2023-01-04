import nodeFetch, {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse
} from "node-fetch";

export interface ApiConfig {
  host?: string;
  protocol?: string;
  port?: string | number;
  timeout?: number;
  logging?: boolean;
  logger?: Function;
  network?: string;
}

export interface ResponseWithData<T> extends Response {
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
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      if (!!fetch) {
        if (endpoint.startsWith("/")) {
          endpoint = endpoint.replace("/", "")
        }

        const res = await fetch(
          `${this.config.protocol}://${this.config.host}:${this.config.port}/${endpoint}`,
          {
            method: "GET",
            headers: this.config.network ? [["x-network", this.config.network]] : undefined
          }
        );

        let data;

        try {
          data = await res.clone().json()
        } catch {
          try {
            data = await res.clone().text()
          } catch {}
        }

        return {
          status: res.status,
          statusText: res.statusText,
          data,
          headers: Object.fromEntries(res.headers.entries()),
          config: undefined as any
        };
      }

      return await this.request().get<T>(endpoint, config);
    } catch (error: any) {
      if (error.response && error.response.status) {
        return error.response;
      }

      throw error;
    }
  }

  public async post<T = any>(
    endpoint: string,
    body: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.replace("/", "")
    }

    try {
      if (!!fetch) {
        if (endpoint.startsWith("/")) {
          endpoint = endpoint.replace("/", "")
        }

        const headers: [string, string][] = [["content-type", "application/json"]];

        if (this.config.network) {
          headers.push(["x-network", this.config.network]);
        }

        const res = await fetch(
          `${this.config.protocol}://${this.config.host}:${this.config.port}/${endpoint}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers
          }
        );

        let data;

        try {
          data = await res.clone().json()
        } catch {
          try {
            data = await res.clone().text()
          } catch {}
        }
  
        return {
          status: res.status,
          statusText: res.statusText,
          data,
          headers: Object.fromEntries(res.headers.entries()),
          config: undefined as any
        };
      }

      return await this.request().post(endpoint, body, config);
    } catch (error: any) {
      if (error.response && error.response.status) {
        return error.response;
      }

      throw error;
    }
  }

  public async request<T = unknown>(endpoint: string, init?: RequestInit): Promise<ResponseWithData<T>> {
    const headers = new Headers(init?.headers || {});
    const baseURL = `${this.config.protocol}://${this.config.host}:${this.config.port}`;

    if (this.config.network) {
      headers.append("x-network", this.config.network);
    }

    if (this.config.logging) {
      this.config.logger!(`Requesting: ${baseURL}/${endpoint}`);
    }

    let res: Response | NodeFetchResponse | undefined = undefined;

    if (!!fetch) {
      // web fetch
      res = await fetch(
        `${baseURL}/${endpoint}`,
        {
          ...(init || {}),
          headers
        }  
      );
    } else {
      // node fetch
      res = await nodeFetch(
        `${baseURL}/${endpoint}`,
        {
          ...(init as NodeFetchRequestInit || {}),
          headers
        }  
      );
    }

    if (this.config.logging && !!res) {
      this.config.logger!(
        `Response:   ${res.url} - ${res.status}`
      );
    }

    if (typeof res === "undefined") {
      throw new Error("Undefined response");
    }

    const contentType = res.headers.get("content-type");
    const response: Partial<ResponseWithData<T>> = res as any;

    if (contentType?.startsWith("application/json")) {
      response.data = await res.clone().json();
    } else {
      try {
        response.data = await res.clone().text() as T;
      } catch {
        response.data = await res.clone().arrayBuffer() as T;
      }
    }

    if (response.status && (response.status >= 300 || response.status < 200)) {
      throw response;
    }
    
    return response as ResponseWithData<T>;
  }
}
