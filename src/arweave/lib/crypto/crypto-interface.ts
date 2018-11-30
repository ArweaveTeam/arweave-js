import { JWKInterface } from "../Wallet";

export interface CryptoInterface {

    generateJWK(): Promise<JWKInterface>;

    sign(jwk: JWKInterface, data: any): Promise<ArrayBuffer>

    hash(data: any):  Promise<string>
}
