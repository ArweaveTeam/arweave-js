import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
import { Transaction } from "./lib/transaction";
import { JWKInterface } from './lib/Wallet';
export declare class Transactions {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
    getPrice(byteSize: number, targetAddress?: string): Promise<string>;
    get(id: string): Promise<Transaction>;
    getStatus(id: string): Promise<number>;
    sign(transaction: Transaction, jwk: JWKInterface): Promise<Transaction>;
}
