/// <reference types="node" />
import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
import { Transaction } from "./lib/transaction";
import { JWKInterface } from './lib/Wallet';
import { AxiosResponse } from "axios";
export declare class Transactions {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
    getPrice(byteSize: number, targetAddress?: string): Promise<string>;
    get(id: string): Promise<Transaction>;
    getStatus(id: string): Promise<number>;
    sign(transaction: Transaction, jwk: JWKInterface): Promise<Transaction>;
    post(transaction: Transaction | Buffer | string | object): Promise<AxiosResponse>;
}
