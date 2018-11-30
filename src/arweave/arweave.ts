import { Ar } from "./ar";
import { Api, ApiConfig } from "./lib/api";
import { CryptoInterface } from "./lib/crypto/crypto-interface";
import { Network } from "./network";
import { Transactions } from './transactions';
import { Wallets } from './wallets';


interface Config<T = object>{
    api: ApiConfig
    crypto: CryptoInterface
}

export class Arweave {
    
    public api: Api;

    public wallets: Wallets;

    public transactions: Transactions;

    public network: Network;
    
    public ar: Ar;
    
    public crypto: CryptoInterface;

    constructor(config: Config){

        this.crypto = config.crypto;

        this.api = new Api(config.api);
        this.wallets = new Wallets(this.api, config.crypto);
        this.transactions = new Transactions(this.api, config.crypto);
        this.network = new Network(this.api);
        this.ar = new Ar;

    }




}

