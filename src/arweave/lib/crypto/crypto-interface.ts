import { JWKInterface } from "../wallet";

export interface CryptoInterface {

    generateJWK(): Promise<JWKInterface>;

    sign(jwk: JWKInterface, data: Uint8Array): Promise<Uint8Array>

    verify(publicModulus: string, data: Uint8Array, signature: Uint8Array): Promise<boolean>

    hash(data: Uint8Array): Promise<Uint8Array>
}
