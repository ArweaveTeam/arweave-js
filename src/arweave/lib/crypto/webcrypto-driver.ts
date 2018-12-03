import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";
import { ArweaveUtils } from "../utils";

export class WebCryptoDriver implements CryptoInterface {

    public readonly keyLength = 4096;
    public readonly publicExponent = 0x10001;
    public readonly hashAlgorithm = 'sha256';
    public readonly driver?: SubtleCrypto;


	constructor() {
        if (!this.detectWebCrypto()) {
            throw new Error('SubtleCrypto not available!');
        }

        this.driver = window.crypto.subtle;
    }


    async generateJWK(): Promise<JWKInterface> {

        let cryptoKey = await this
            .driver
            .generateKey(
                {
                    name: 'RSA-PSS',
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {
                        name: 'SHA-256',
                    }
                },
                true,
                ['sign']
            );

        let jwk = await this
            .driver
            .exportKey(
                'jwk',
                cryptoKey.privateKey
            );

        return {
            'kty': jwk.kty,
            'e'  : jwk.e,
            'n'  : jwk.n,
            'd'  : jwk.d,
            'p'  : jwk.p,
            'q'  : jwk.q,
            'dp' : jwk.dp,
            'dq' : jwk.dq,
            'qi' : jwk.qi,
        };
    }

    /**
     * 
     * @param jwk 
     * @param data 
     */
    async sign(jwk: JWKInterface, data: any): Promise<Uint8Array>{
        let signature = await this
            .driver
            .sign({
                    name: 'RSA-PSS',
                    saltLength: 0,
                },
                (await this.jwkToCryptoKey(jwk)),
                data
            );

        return new Uint8Array(signature);
    }

    async hash(data: Uint8Array): Promise<Uint8Array> {
        let digest = await this
            .driver
            .digest(
                'SHA-256',
                data
            );

        return new Uint8Array(digest);
    }

    private async jwkToCryptoKey(jwk: JWKInterface): Promise<CryptoKey>{
        return this.driver.importKey(
            'jwk',
            jwk,
            {
                name: 'RSA-PSS',
                hash: {
                    name: 'SHA-256',
                }
            },
            false,
            ['sign']
        );
    }

    private detectWebCrypto(){
        if (!window || !window.crypto || !window.crypto.subtle) {
            return false;
        }

        let subtle = window.crypto.subtle;

        if (typeof subtle.generateKey != 'function') {
            return false;
        }

        if (typeof subtle.importKey != 'function') {
            return false;
        }

        if (typeof subtle.exportKey != 'function') {
            return false;
        }

        if (typeof subtle.digest != 'function') {
            return false;
        }

        if (typeof subtle.sign != 'function') {
            return false;
        }

        return true;
    }

}