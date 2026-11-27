import { JWKInterface, JWKPublicInterface } from "../wallet";
import CryptoInterface, { SignatureOptions } from "./crypto-interface";
import * as ArweaveUtils from "../utils";

export default class WebCryptoDriver implements CryptoInterface {
  public readonly keyLength = 4096;
  public readonly publicExponent = 0x10001;
  public readonly hashAlgorithm = "sha256";
  public readonly driver: SubtleCrypto;

  constructor() {
    if (!this.detectWebCrypto()) {
      throw new Error("SubtleCrypto not available!");
    }

    this.driver = crypto.subtle;
  }

  public async generateJWK(): Promise<JWKInterface> {
    let cryptoKey = await this.driver.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256",
        },
      },
      true,
      ["sign"]
    );

    let jwk = await this.driver.exportKey("jwk", cryptoKey.privateKey!);

    return {
      kty: jwk.kty!,
      e: jwk.e!,
      n: jwk.n!,
      d: jwk.d,
      p: jwk.p,
      q: jwk.q,
      dp: jwk.dp,
      dq: jwk.dq,
      qi: jwk.qi,
    };
  }

  public async sign(
    jwk: JWKInterface,
    data: Uint8Array,
    { saltLength }: SignatureOptions = {}
  ): Promise<Uint8Array> {
    let signature = await this.driver.sign(
      {
        name: "RSA-PSS",
        saltLength: saltLength ?? 32,
      },
      await this.jwkToCryptoKey(jwk),
      data as Uint8Array<ArrayBuffer>
    );

    return new Uint8Array(signature);
  }

  public async hash(
    data: Uint8Array,
    algorithm: string = "SHA-256"
  ): Promise<Uint8Array> {
    let digest = await this.driver.digest(
      algorithm,
      data as Uint8Array<ArrayBuffer>
    );

    return new Uint8Array(digest);
  }

  public async verify(
    publicModulus: string,
    data: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const publicKey = {
      kty: "RSA",
      e: "AQAB",
      n: publicModulus,
    };

    const key = await this.jwkToPublicCryptoKey(publicKey);
    const modulusLength = (key.algorithm as RsaHashedKeyAlgorithm)
      .modulusLength;

    // Largest salt PSS allows with SHA-256 (RFC 8017 §9.1.1)
    const maxSaltLength = Math.ceil((modulusLength - 1) / 8) - 32 - 2;

    // WebCrypto needs the exact salt length. Try the one the signature
    // encodes first, then the common ones in case recovery finds nothing.
    const recovered = await this.recoverPssSaltLength(
      publicModulus,
      modulusLength,
      signature
    );
    const saltLengths = [
      ...new Set([recovered, 0, 32, maxSaltLength]),
    ].filter((length): length is number => length !== undefined && length >= 0);

    for (const saltLength of saltLengths) {
      const valid = await this.driver.verify(
        {
          name: "RSA-PSS",
          saltLength,
        },
        key,
        signature as Uint8Array<ArrayBuffer>,
        data as Uint8Array<ArrayBuffer>
      );
      if (valid) {
        return true;
      }
    }

    const details = {
      algorithm: key.algorithm.name,
      modulusLength,
      keyUsages: key.usages,
      saltLengthsAttempted: saltLengths.join(", "),
    };
    console.warn(
      "Transaction Verification Failed! \n",
      `Details: ${JSON.stringify(details, null, 2)} \n`,
      "N.B. ArweaveJS is only guaranteed to verify txs created using ArweaveJS."
    );

    return false;
  }

  /**
   * Reads the salt length out of an RSA-PSS signature (RFC 8017 §9.1.2), so
   * signatures made with any salt length can be verified. Returns undefined
   * for a malformed encoding. This is only a hint: WebCrypto does the actual
   * verification.
   */
  private async recoverPssSaltLength(
    publicModulus: string,
    modulusLength: number,
    signature: Uint8Array
  ): Promise<number | undefined> {
    const hashLength = 32;
    const n = bytesToBigInt(ArweaveUtils.b64UrlToBuffer(publicModulus));
    const s = bytesToBigInt(signature);
    if (signature.byteLength !== Math.ceil(modulusLength / 8) || s >= n) {
      return undefined;
    }

    const emBits = modulusLength - 1;
    const emLength = Math.ceil(emBits / 8);
    const em = bigIntToBytes(modPow(s, 65537n, n), emLength);
    if (!em || em[emLength - 1] !== 0xbc) {
      return undefined;
    }

    const dbLength = emLength - hashLength - 1;
    const h = em.slice(dbLength, emLength - 1);
    const db = em.slice(0, dbLength);

    // Unmask with MGF1(SHA-256)
    for (let counter = 0; counter * hashLength < dbLength; counter++) {
      const block = new Uint8Array(hashLength + 4);
      block.set(h);
      new DataView(block.buffer).setUint32(hashLength, counter);
      const mask = new Uint8Array(await this.driver.digest("SHA-256", block));
      const offset = counter * hashLength;
      for (let i = 0; i < hashLength && offset + i < dbLength; i++) {
        db[offset + i] ^= mask[i];
      }
    }
    db[0] &= 0xff >> (8 * emLength - emBits);

    // DB is zero padding, then 0x01, then the salt
    const separator = db.findIndex((byte) => byte !== 0);
    if (separator === -1 || db[separator] !== 0x01) {
      return undefined;
    }
    return dbLength - separator - 1;
  }

  private async jwkToCryptoKey(jwk: JWKInterface): Promise<CryptoKey> {
    // Import only the RSA fields. WebCrypto rejects keys whose extra JWK
    // metadata (alg, key_ops, use) doesn't fit RSA-PSS signing.
    const { kty, e, n, d, p, q, dp, dq, qi } = jwk;
    return this.driver.importKey(
      "jwk",
      { kty, e, n, d, p, q, dp, dq, qi },
      {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256",
        },
      },
      false,
      ["sign"]
    );
  }

  private async jwkToPublicCryptoKey(
    publicJwk: JWKPublicInterface
  ): Promise<CryptoKey> {
    return this.driver.importKey(
      "jwk",
      publicJwk,
      {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256",
        },
      },
      false,
      ["verify"]
    );
  }

  private detectWebCrypto() {
    if (typeof crypto === "undefined") {
      return false;
    }
    const subtle = crypto?.subtle;
    if (subtle === undefined) {
      return false;
    }
    const names = <const>[
      "generateKey",
      "importKey",
      "exportKey",
      "digest",
      "sign",
    ];
    return names.every((name) => typeof subtle[name] === "function");
  }

  public async encrypt(
    data: Uint8Array,
    key: string | Uint8Array,
    salt?: string
  ): Promise<Uint8Array> {
    const initialKey = await this.driver.importKey(
      "raw",
      typeof key == "string"
        ? ArweaveUtils.stringToBuffer(key)
        : (key as Uint8Array<ArrayBuffer>),
      {
        name: "PBKDF2",
        length: 32,
      },
      false,
      ["deriveKey"]
    );

    // const salt = ArweaveUtils.stringToBuffer("salt");
    // create a random string for deriving the key
    // const salt = this.driver.randomBytes(16).toString('hex');

    const derivedkey = await this.driver.deriveKey(
      {
        name: "PBKDF2",
        salt: salt
          ? ArweaveUtils.stringToBuffer(salt)
          : ArweaveUtils.stringToBuffer("salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      initialKey,
      {
        name: "AES-CBC",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );

    const iv = new Uint8Array(16);

    crypto.getRandomValues(iv);

    const encryptedData = await this.driver.encrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      derivedkey,
      data as Uint8Array<ArrayBuffer>
    );

    return ArweaveUtils.concatBuffers([iv, encryptedData]);
  }

  public async decrypt(
    encrypted: Uint8Array,
    key: string | Uint8Array,
    salt?: string
  ): Promise<Uint8Array> {
    const initialKey = await this.driver.importKey(
      "raw",
      typeof key == "string"
        ? ArweaveUtils.stringToBuffer(key)
        : (key as Uint8Array<ArrayBuffer>),
      {
        name: "PBKDF2",
        length: 32,
      },
      false,
      ["deriveKey"]
    );

    // const salt = ArweaveUtils.stringToBuffer("pepper");

    const derivedkey = await this.driver.deriveKey(
      {
        name: "PBKDF2",
        salt: salt
          ? ArweaveUtils.stringToBuffer(salt)
          : ArweaveUtils.stringToBuffer("salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      initialKey,
      {
        name: "AES-CBC",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );

    const iv = encrypted.slice(0, 16) as Uint8Array<ArrayBuffer>;

    const data = await this.driver.decrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      derivedkey,
      encrypted.slice(16) as Uint8Array<ArrayBuffer>
    );

    // We're just using concat to convert from an array buffer to uint8array
    return ArweaveUtils.concatBuffers([data]);
  }
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return BigInt("0x" + (hex || "0"));
}

function bigIntToBytes(value: bigint, length: number): Uint8Array | undefined {
  const hex = value.toString(16).padStart(length * 2, "0");
  if (hex.length > length * 2) {
    return undefined;
  }
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent >>= 1n;
  }
  return result;
}
