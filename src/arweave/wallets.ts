import { AxiosResponse } from "axios";
import { Api } from "./lib/api";

export class Wallets {
    
    private api: Api;

    constructor(api: Api){
        this.api = api;
    }

    public getBalance(address: string): Promise<string>{
        return this.api.get(`wallet/${address}/balance`, {
            transformResponse: [
                /**
                 * We need to specify a response transformer to override
                 * the default JSON.parse transformation, as this causes
                 * balances to be converted to a number and we want to
                 * return it as a winston string.
                 * @param data 
                 */
                function(data): string {
                return data;
              }
            ]
        }).then( response => {
            return response.data;
        });
    }

    public getLastTransaction(address: string): Promise<string>{
        return this.api.get(`wallet/${address}/last_tx`).then( response => {
            return response.data;
        });
    }


}

