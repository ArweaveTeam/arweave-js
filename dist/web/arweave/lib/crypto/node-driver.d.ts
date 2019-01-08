/// <reference types="node" />
import { JWKInterface } from "../wallet";
import { CryptoInterface } from "./crypto-interface";
export declare class NodeCryptoDriver implements CryptoInterface {
    readonly keyLength = 4096;
    readonly publicExponent = 65537;
    readonly hashAlgorithm = "sha256";
    generateJWK(): Promise<JWKInterface>;
    sign(jwk: object, data: Uint8Array): Promise<Uint8Array>;
    verify(publicModulus: string, data: Uint8Array, signature: Uint8Array): Promise<boolean>;
    hash(data: Buffer): Promise<Uint8Array>;
    jwkToPem(jwk: object): string;
    private pemToJWK;
}
