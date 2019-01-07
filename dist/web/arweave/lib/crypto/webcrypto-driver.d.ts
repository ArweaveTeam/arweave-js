import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";
export declare class WebCryptoDriver implements CryptoInterface {
    readonly keyLength = 4096;
    readonly publicExponent = 65537;
    readonly hashAlgorithm = "sha256";
    readonly driver?: SubtleCrypto;
    constructor();
    generateJWK(): Promise<JWKInterface>;
    sign(jwk: JWKInterface, data: Uint8Array): Promise<Uint8Array>;
    hash(data: Uint8Array): Promise<Uint8Array>;
    verify(publicModulus: string, data: Uint8Array, signature: Uint8Array): Promise<boolean>;
    private jwkToCryptoKey;
    private jwkToPublicCryptoKey;
    private detectWebCrypto;
}
