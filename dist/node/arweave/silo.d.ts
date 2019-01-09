import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
export declare class Silo {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
}
