import { Api } from "./lib/api";

export interface NetworkInfo{
    hosnetworkt: string,
    version: number,
    release: number,
    height: number,
    current: string,
    blocks: number,
    peers: number,
    queue_length: number,
    node_state_latency: number
}

export interface PeerList extends Array<string>{}

export class Network {
    
    private api: Api;

    constructor(api: Api){
        this.api = api;
    }

    public info(): Promise<NetworkInfo>{
        return this.api.get(`info`).then( response => {
            return response.data;
        });
    }

    public peers(): Promise<PeerList>{
        return this.api.get(`peers`).then( response => {
            return response.data;
        });
    }

}

