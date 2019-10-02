import Api from "./lib/api";

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

export default class Network {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public getInfo(): Promise<NetworkInfoInterface> {
    return this.api.getJson(`info`).then(response => {
      return response;
    });
  }

  public getPeers(): Promise<PeerList> {
    return this.api.getJson(`peers`).then(response => {
      return response;
    });
  }
}
