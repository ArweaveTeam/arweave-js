import { JWKInterface } from "../Wallet";
import { CryptoInterface } from "./crypto-interface";

import {pem2jwk, jwk2pem} from "./pem";

const crypto = require('crypto');

export class NodeCryptoDriver implements CryptoInterface {

    public readonly keyLength = 4096;
    public readonly publicExponent = 0x10001;
    public readonly hashAlgorithm = 'sha256';

    generateJWK(): Promise<JWKInterface> {

        if (typeof !crypto.generateKeyPair == 'function') {
            throw new Error('Keypair generation not supported in this version of Node, only supported in versions 10.x+');
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

    /**
     * 
     * @param jwk 
     * @param data 
     */
    sign(jwk: object, data: Uint8Array): Promise<Uint8Array>{
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

    hash(data: Buffer): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.hashAlgorithm)
                .update(data)
                .digest()
            );
        });
    }

    private jwkToPem(jwk: object): string{
        return jwk2pem(jwk);
    }

    private pemToJWK(pem: string): JWKInterface{
        let jwk = pem2jwk(pem);
        return jwk;
    }

}