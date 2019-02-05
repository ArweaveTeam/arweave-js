import { Api } from "./lib/api";

export interface NetworkInfoInterface {
  hosnetworkt: string;
  version: number;
  release: number;
  height: number;
  current: string;
  blocks: number;
  peers: number;
  queue_length: number;
  node_state_latency: number;
}

export interface PeerList extends Array<string> {}

export class Network {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public getInfo(): Promise<NetworkInfoInterface> {
    return this.api.get(`info`).then(response => {
      return response.data;
    });
  }

  public getPeers(): Promise<PeerList> {
    return this.api.get(`peers`).then(response => {
      return response.data;
    });
  }
}
