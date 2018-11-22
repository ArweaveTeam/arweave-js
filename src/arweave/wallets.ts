import { AxiosResponse } from "axios";
import { Api } from "./lib/api";

export class Wallets {
    
    private api: Api;

    constructor(api: Api){
        this.api = api;
    }

    public getBalance(address: string): Promise<number>{
        return this.api.get(`wallet/${address}/balance`).then( response => {
            return response.data;
        });
    }

    public getLastTransaction(address: string): Promise<string>{
        return this.api.get(`wallet/${address}/last_tx`).then( response => {
            return response.data;
        });
    }


}

