import { Api, ApiConfig } from "./lib/api";
import { Wallets } from './wallets';
import { Transactions } from './transactions';
import { Network } from "./network";

interface Config<T = object>{
    api: ApiConfig,
}

export class Arweave {
    
    private api: Api;


    public readonly wallets: Wallets;

    public readonly transactions: Transactions;

    public readonly network: Network;


    constructor(config: Config){
        this.api = new Api(config.api);
        this.wallets = new Wallets(this.api);
        this.transactions = new Transactions(this.api);
        this.network = new Network(this.api);
    }
    


}

