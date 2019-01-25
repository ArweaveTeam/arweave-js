import { Api } from "./lib/api";
import { CryptoInterface } from "./lib/crypto/crypto-interface";
import { JWKInterface } from "./lib/wallet";
export declare class Wallets {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
    /**
     * Get the wallet balance for the given address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getBalance(address: string): Promise<string>;
    /**
     * Get the last transaction ID for the given wallet address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getLastTransactionID(address: string): Promise<string>;
    generate(): Promise<JWKInterface>;
    jwkToAddress(jwk: JWKInterface): Promise<string>;
}
