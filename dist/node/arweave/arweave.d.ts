import { Ar } from "./ar";
import { Api, ApiConfig } from "./lib/api";
import { CryptoInterface } from "./lib/crypto/crypto-interface";
import { Network } from "./network";
import { Transactions } from "./transactions";
import { Wallets } from "./wallets";
import { Transaction, Tag } from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import { ArweaveUtils } from "./lib/utils";
import { Silo } from "./silo";
export interface Config<T = object> {
    api: ApiConfig;
    crypto: CryptoInterface;
}
export interface CreateTransactionInterface {
    [key: string]: any;
    last_tx: string;
    owner: string;
    tags: Tag[];
    target: string;
    quantity: string;
    data: string | Uint8Array;
    reward: string;
}
export declare class Arweave {
    api: Api;
    wallets: Wallets;
    transactions: Transactions;
    network: Network;
    ar: Ar;
    silo: Silo;
    crypto: CryptoInterface;
    utils: ArweaveUtils;
    constructor(config: Config);
    getConfig(): Config;
    createTransaction(attributes: Partial<CreateTransactionInterface>, jwk: JWKInterface): Promise<Transaction>;
    createSiloTransaction(attributes: Partial<CreateTransactionInterface>, jwk: JWKInterface, siloUri: string): Promise<Transaction>;
}
