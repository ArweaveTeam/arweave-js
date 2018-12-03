import { JWKInterface } from "../Wallet";
export interface CryptoInterface {
    generateJWK(): Promise<JWKInterface>;
    sign(jwk: JWKInterface, data: Uint8Array): Promise<Uint8Array>;
    hash(data: Uint8Array): Promise<Uint8Array>;
}
