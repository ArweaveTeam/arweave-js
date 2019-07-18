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
      logger: config.logger || console.log
    };
  }

  public async get(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    try {
      return await this.request().get(endpoint, config);
    } catch (error) {
      if (error.response && error.response.status) {
        return error.response;
      }

      throw error;
    }
  }

  public async post(
    endpoint: string,
    body: Buffer | string | object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    try {
      return await this.request().post(endpoint, body, config);
    } catch (error) {
      if (error.response && error.response.status) {
        return error.response;
      }

      throw error;
    }
  }

  /**
   * Get an AxiosInstance with the base configuration setup to fire off
   * a request to the network.
   */
  public request(): AxiosInstance {
    let instance = Axios.create({
      baseURL: `${this.config.protocol}://${this.config.host}:${
        this.config.port
      }`,
      timeout: this.config.timeout
    });

    if (this.config.logging) {
      instance.interceptors.request.use(request => {
        this.config.logger!(`Requesting: ${request.baseURL}/${request.url}`);
        return request;
      });

      instance.interceptors.response.use(response => {
        this.config.logger!(
          `Response:   ${response.config.url} - ${response.status}`
        );
        return response;
      });
    }

    return instance;
  }
}
