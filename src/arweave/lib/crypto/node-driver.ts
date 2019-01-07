import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";

import { pemTojwk, jwkTopem } from "./pem";

const crypto = require('crypto');

export class NodeCryptoDriver implements CryptoInterface {

    public readonly keyLength = 4096;
    public readonly publicExponent = 0x10001;
    public readonly hashAlgorithm = 'sha256';

    public generateJWK(): Promise<JWKInterface> {
        if (typeof crypto.generateKeyPair != "function") {
            throw new Error('Keypair generation not supported in this version of Node, only supported in versions 10+');
        }

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

    public sign(jwk: object, data: Uint8Array): Promise<Uint8Array> {
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

    public verify(publicModulus: string, data: Uint8Array, signature: Uint8Array): Promise<boolean> {
        return new Promise((resolve, reject) => {

            const publicKey = {
                kty: 'RSA',
                e: 'AQAB',
                n: publicModulus,
            };

            const pem = this.jwkToPem(publicKey);

            resolve(crypto
                .createVerify(this.hashAlgorithm)
                .update(data)
                .verify({
                    key: pem,
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: 0
                }, signature)
            );
        });
    }

    public hash(data: Buffer): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.hashAlgorithm)
                .update(data)
                .digest()
            );
        });
    }

    public jwkToPem(jwk: object): string {
        return jwkTopem(jwk);
    }

    private pemToJWK(pem: string): JWKInterface {
        let jwk = pemTojwk(pem);
        return jwk;
    }

}