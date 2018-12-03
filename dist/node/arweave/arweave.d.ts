import { Ar } from "./ar";
import { Api, ApiConfig } from "./lib/api";
import { CryptoInterface } from "./lib/crypto/crypto-interface";
import { Network } from "./network";
import { Transactions } from './transactions';
import { Wallets } from './wallets';
import { TransactionInterface, Transaction } from "./lib/Transaction";
import { JWKInterface } from "./lib/Wallet";
import { ArweaveUtils } from "./lib/utils";
interface Config<T = object> {
    api: ApiConfig;
    crypto: CryptoInterface;
}
export declare class Arweave {
    api: Api;
    wallets: Wallets;
    transactions: Transactions;
    network: Network;
    ar: Ar;
    crypto: CryptoInterface;
    utils: ArweaveUtils;
    constructor(config: Config);
    createTransaction(attributes: Partial<TransactionInterface>, jwk: JWKInterface): Promise<Transaction>;
}
export {};
