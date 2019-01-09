"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pem_1 = require("./pem");
const crypto = require('crypto');
class NodeCryptoDriver {
    constructor() {
        this.keyLength = 4096;
        this.publicExponent = 0x10001;
        this.hashAlgorithm = 'sha256';
        this.encryptionAlgorithm = 'aes-256-cbc';
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
    /**
     * If a key is passed as a buffer it *must* be exactly 32 bytes.
     * If a key is passed as a string then any length may be used.
     *
     * @param {Buffer} data
     * @param {(string | Buffer)} key
     * @returns {Promise<Uint8Array>}
     */
    async encrypt(data, key) {
        // If the key is a string then we'll treat it as a passphrase and derive
        // an actual key from that passphrase. If it's not a string then we'll
        // assume it's a byte array and we'll use that as the encryption key directly.
        if (typeof key == 'string') {
            // As we're using CBC with a randomised IV per cypher we don't really need
            // an additional random salt per passphrase.
            key = crypto.pbkdf2Sync(key, 'salt', 100000, 32, this.hashAlgorithm);
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.encryptionAlgorithm, key, iv);
        const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
        return encrypted;
    }
    /**
     * If a key is passed as a buffer it *must* be exactly 32 bytes.
     * If a key is passed as a string then any length may be used.
     *
     * @param {Buffer} encrypted
     * @param {(string | Buffer)} key
     * @returns {Promise<Uint8Array>}
     */
    async decrypt(encrypted, key) {
        try {
            // If the key is a string then we'll treat it as a passphrase and derive
            // an actual key from that passphrase. If it's not a string then we'll
            // assume it's a byte array and we'll use that as the encryption key directly.
            if (typeof key == 'string') {
                // As we're using CBC with a randomised IV per cypher we don't really need
                // an additional random salt per passphrase.
                key = crypto.pbkdf2Sync(key, 'salt', 100000, 32, this.hashAlgorithm);
            }
            const iv = encrypted.slice(0, 16);
            const data = encrypted.slice(16);
            const decipher = crypto.createDecipheriv(this.encryptionAlgorithm, key, iv);
            const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
            return decrypted;
        }
        catch (error) {
            throw new Error('Failed to decrypt');
        }
    }
    jwkToPem(jwk) {
        return pem_1.jwkTopem(jwk);
    }
    pemToJWK(pem) {
        let jwk = pem_1.pemTojwk(pem);
        return jwk;
    }
}
exports.NodeCryptoDriver = NodeCryptoDriver;
//# sourceMappingURL=node-driver.js.map