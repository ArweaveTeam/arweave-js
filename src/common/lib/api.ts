import Axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";

export interface ApiConfig {
  host?: string;
  protocol?: string;
  port?: string | number;
  timeout?: number;
  logging?: boolean;
  logger?: Function;
}

export default class Api {
  public readonly METHOD_GET = "GET";
  public readonly METHOD_POST = "POST";

  public config!: ApiConfig;

  constructor(config: ApiConfig, fetch) {
    this.fetch = fetch
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
      logger: config.logger || console.log
    };
  }

  private doFetch(
    url: string,
    fetchConfig: Object
  ): <Promise<Response>> {
    return this.fetch(`${this.config.protocol}:\/\/${this.config.host}:${this.config.port}/${url}`, fetchConfig)
  }

  /*
  baseURL: `${this.config.protocol}://${this.config.host}:${
    this.config.port
  }`,
  timeout: this.config.timeout*/

  public async get(
    endpoint: string,
    config?: Object
  ): Promise<Response> {
    try {
      return await this.doFetch(endpoint, config)
    } catch (error) {
      throw error;
    }
  }

  public async post(
    endpoint: string,
    body: Buffer | string | object,
    config?: Object
  ): Promise<Response> {
    try {
      config.body = typeof body === 'object' ? JSON.stringify(body) : body
      config.method = 'POST'
      return await this.doFetch(endpoint, config)
    } catch (error) {
      if (error.response && error.response.status) {
        return error.response;
      }

      throw error;
    }
  }
}
