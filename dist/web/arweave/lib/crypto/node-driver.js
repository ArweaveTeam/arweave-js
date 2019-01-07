import { pemTojwk, jwkTopem } from "./pem";
const crypto = require('crypto');
export class NodeCryptoDriver {
    constructor() {
        this.keyLength = 4096;
        this.publicExponent = 0x10001;
        this.hashAlgorithm = 'sha256';
    }
    generateJWK() {
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
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                }
                resolve(this.pemToJWK(privateKey));
            });
        });
    }
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
    verify(publicModulus, data, signature) {
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
            }, signature));
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
        return jwkTopem(jwk);
    }
    pemToJWK(pem) {
        let jwk = pemTojwk(pem);
        return jwk;
    }
}
//# sourceMappingURL=node-driver.js.map