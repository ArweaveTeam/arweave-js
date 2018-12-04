import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";
export declare class WebCryptoDriver implements CryptoInterface {
    readonly keyLength = 4096;
    readonly publicExponent = 65537;
    readonly hashAlgorithm = "sha256";
    readonly driver?: SubtleCrypto;
    constructor();
    generateJWK(): Promise<JWKInterface>;
    /**
     *
     * @param jwk
     * @param data
     */
    sign(jwk: JWKInterface, data: any): Promise<Uint8Array>;
    hash(data: Uint8Array): Promise<Uint8Array>;
    private jwkToCryptoKey;
    private detectWebCrypto;
}
