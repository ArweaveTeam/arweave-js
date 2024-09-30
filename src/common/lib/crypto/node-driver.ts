import { JWKInterface } from "../wallet";
import CryptoInterface, { SignatureOptions } from "./crypto-interface";
import { pemTojwk, jwkTopem } from "./pem";
import * as crypto from "crypto";

export default class NodeCryptoDriver implements CryptoInterface {
  public readonly keyLength = 4096;
  public readonly publicExponent = 0x10001;
  public readonly hashAlgorithm = "sha256";
  public readonly encryptionAlgorithm = "aes-256-cbc";

  public generateJWK(): Promise<JWKInterface> {
    if (typeof crypto.generateKeyPair != "function") {
      throw new Error(
        "Keypair generation not supported in this version of Node, only supported in versions 10+"
      );
    }

    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        "rsa",
        <crypto.RSAKeyPairOptions<"pem", "pem">>{
          modulusLength: this.keyLength,
          publicExponent: this.publicExponent,
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          publicKeyEncoding: { type: "pkcs1", format: "pem" },
        },
        (err: any, publicKey: string, privateKey: string) => {
          if (err) {
            reject(err);
          }
          resolve(this.pemToJWK(privateKey));
        }
      );
    });
  }

  public sign(
    jwk: object,
    data: Uint8Array,
    { saltLength }: SignatureOptions = {}
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      resolve(
        crypto
          .createSign(this.hashAlgorithm)
          .update(data)
          .sign({
            key: this.jwkToPem(jwk),
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength,
          })
      );
    });
  }

  public verify(
    publicModulus: string,
    data: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const publicJwk = {
        kty: "RSA",
        e: "AQAB",
        n: publicModulus,
      };

      const pem = this.jwkToPem(publicJwk); //?
      const keyObject = crypto.createPublicKey({
        key: pem,
        format: "pem",
      });

      const verify = crypto.createVerify(this.hashAlgorithm);
      verify.update(data);
      const verifyResult = verify.verify(
        {
          key: keyObject,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        },
        signature
      );

      if (!verifyResult) {
        const details = {
          asymmetricKeyType: keyObject.asymmetricKeyType,
          modulusLength: keyObject.asymmetricKeyDetails?.modulusLength,
        };
        console.warn(
          "Transaction Verification Failed! \n" +
            `Details: ${JSON.stringify(details, null, 2)} \n` +
            "N.B. ArweaveJS is only guaranteed to verify txs created using ArweaveJS."
        );
      }

      resolve(verifyResult);
    });
  }

  public hash(
    data: Uint8Array,
    algorithm: string = "SHA-256"
  ): Promise<Uint8Array> {
    if (typeof data === "string") {
      throw new TypeError("Data must be a Uint8Array");
    }
    return new Promise((resolve, reject) => {
      resolve(
        crypto
          .createHash(this.parseHashAlgorithm(algorithm))
          .update(data)
          .digest()
      );
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
  public async encrypt(
    data: Buffer,
    key: string | Buffer,
    salt?: string
  ): Promise<Uint8Array> {
    // create a random string for deriving the key
    // const salt = crypto.randomBytes(16);
    // console.log(salt);

    // As we're using CBC with a randomised IV per cypher we don't really need
    // an additional random salt per passphrase.
    const derivedKey = crypto.pbkdf2Sync(
      key,
      (salt = salt ? salt : "salt"),
      100000,
      32,
      this.hashAlgorithm
    );

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.encryptionAlgorithm,
      derivedKey,
      iv
    );

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
  public async decrypt(
    encrypted: Buffer,
    key: string | Buffer,
    salt?: string
  ): Promise<Uint8Array> {
    try {
      // create a random string for deriving the key
      // const salt = crypto.randomBytes(16).toString('hex');

      // As we're using CBC with a randomised IV per cypher we don't really need
      // an additional random salt per passphrase.
      const derivedKey = crypto.pbkdf2Sync(
        key,
        (salt = salt ? salt : "salt"),
        100000,
        32,
        this.hashAlgorithm
      );

      const iv = encrypted.slice(0, 16);

      const data = encrypted.slice(16);

      const decipher = crypto.createDecipheriv(
        this.encryptionAlgorithm,
        derivedKey,
        iv
      );

      const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]);

      return decrypted;
    } catch (error) {
      throw new Error("Failed to decrypt");
    }
  }

  public jwkToPem(jwk: object): string {
    return jwkTopem(jwk);
  }

  private pemToJWK(pem: string): JWKInterface {
    let jwk = pemTojwk(pem);
    return jwk;
  }

  private parseHashAlgorithm(algorithm: string): string {
    switch (algorithm) {
      case "SHA-256":
        return "sha256";
      case "SHA-384":
        return "sha384";
      default:
        throw new Error(`Algorithm not supported: ${algorithm}`);
    }
  }
}
