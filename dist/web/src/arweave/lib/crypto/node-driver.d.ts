/// <reference types="node" />
import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";
export declare class NodeCryptoDriver implements CryptoInterface {
    readonly keyLength = 4096;
    readonly publicExponent = 65537;
    readonly hashAlgorithm = "sha256";
    generateJWK(): Promise<JWKInterface>;
    /**
     *
     * @param jwk
     * @param data
     */
    sign(jwk: object, data: Uint8Array): Promise<Uint8Array>;
    hash(data: Buffer): Promise<Uint8Array>;
    private jwkToPem;
    private pemToJWK;
}
