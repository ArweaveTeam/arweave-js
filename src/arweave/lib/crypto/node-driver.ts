import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";

const pemToJWK = require('pem-jwk').pem2jwk;
const JWKTopem = require('pem-jwk').jwk2pem;
const crypto = require('crypto');

export class NodeCryptoDriver implements CryptoInterface {

    public readonly keyLength = 4096;
    public readonly publicExponent = 0x10001;
    public readonly hashAlgorithm = 'sha256';

    generateJWK(): Promise<JWKInterface> {
        return new Promise((resolve, reject) => {
            crypto
                .generateKeyPair('rsa', {
                    modulusLength: this.keyLength,
                    publicExponent: this.publicExponent,
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                }, (err: any, publicKey: string, privateKey: string) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(this.pemToJWK(privateKey));
                });
        });
    }

    /**
     * 
     * @param jwk 
     * @param data 
     */
    sign(jwk: object, data: any): Promise<ArrayBuffer>{
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createSign(this.hashAlgorithm)
                .update(data)
                .sign({
                    key: this.jwkToPem(jwk),
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: 0
                }));
        });
    }

    hash(data: any): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.hashAlgorithm)
                .update(data)
                .digest('base64')
            );
        });
    }

    private jwkToPem(jwk: object): string{
        return JWKTopem(jwk);
    }

    private pemToJWK(pem: string): JWKInterface{
        return pemToJWK(pem);
    }

}