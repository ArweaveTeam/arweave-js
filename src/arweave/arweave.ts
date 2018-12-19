import { Ar } from "./ar";
import { Api, ApiConfig } from "./lib/api";
import { CryptoInterface } from "./lib/crypto/crypto-interface";
import { Network } from "./network";
import { Transactions } from './transactions';
import { Wallets } from './wallets';
import { TransactionInterface, Transaction } from "./lib/transaction";
import { JWKInterface } from "./lib/Wallet";
import { ArweaveUtils } from "./lib/utils";


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
    
    public utils: ArweaveUtils;

    constructor(config: Config){

        this.crypto = config.crypto;

        this.api = new Api(config.api);
        this.wallets = new Wallets(this.api, config.crypto);
        this.transactions = new Transactions(this.api, config.crypto);
        this.network = new Network(this.api);
        this.ar = new Ar;

        this.utils = ArweaveUtils;
    }

    public getConfig(): Config {
        return {
            api: this.api.getConfig(),
            crypto: null
        }
    }

    public async createTransaction(attributes: Partial<TransactionInterface>, jwk: JWKInterface){

        if ( !attributes.data && !(attributes.target && attributes.quantity) ) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`);
        }

        let from = await this.wallets.jwkToAddress(jwk);

        if (attributes.owner == undefined) {
            attributes.owner = jwk.n;
        }

        if (attributes.last_tx == undefined) {
            attributes.last_tx = await this.wallets.getLastTransactionID(from);
        }

        if (attributes.reward == undefined) {

            let length = (typeof attributes.data == 'string' && attributes.data.length > 0) ? attributes.data.length : 0;

            let target = (typeof attributes.target == 'string' && attributes.target.length > 0) ? attributes.target : null;

            attributes.reward = await this.transactions.getPrice(length, target);
        }

        if (attributes.data) {
            attributes.data = ArweaveUtils.stringToB64Url(attributes.data);
        }

        return new Transaction(attributes);
    }

}

