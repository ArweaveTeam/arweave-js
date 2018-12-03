"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pemToJWK = require('pem-jwk').pem2jwk;
const JWKTopem = require('pem-jwk').jwk2pem;
const crypto = require('crypto');
class NodeCryptoDriver {
    constructor() {
        this.keyLength = 4096;
        this.publicExponent = 0x10001;
        this.hashAlgorithm = 'sha256';
    }
    generateJWK() {
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
            }, (err, publicKey, privateKey) => {
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
    sign(jwk, data) {
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
    hash(data) {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.hashAlgorithm)
                .update(data)
                .digest());
        });
    }
    jwkToPem(jwk) {
        return JWKTopem(jwk);
    }
    pemToJWK(pem) {
        return pemToJWK(pem);
    }
}
exports.NodeCryptoDriver = NodeCryptoDriver;
//# sourceMappingURL=node-driver.js.map