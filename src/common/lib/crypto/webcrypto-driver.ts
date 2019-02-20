import { JWKInterface, JWKPublicInterface } from "../wallet";
import CryptoInterface from "./crypto-interface";
import ArweaveUtils from "../utils";

export default class WebCryptoDriver implements CryptoInterface {
  public readonly keyLength = 4096;
  public readonly publicExponent = 0x10001;
  public readonly hashAlgorithm = "sha256";
  public readonly driver: SubtleCrypto;

  constructor() {
    if (!this.detectWebCrypto()) {
      throw new Error("SubtleCrypto not available!");
    }

    this.driver = window.crypto.subtle;
  }

  public async generateJWK(): Promise<JWKInterface> {
    let cryptoKey = await this.driver.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256"
        }
      },
      true,
      ["sign"]
    );

    let jwk = await this.driver.exportKey("jwk", cryptoKey.privateKey);

    return {
      kty: jwk.kty!,
      e: jwk.e!,
      n: jwk.n!,
      d: jwk.d,
      p: jwk.p,
      q: jwk.q,
      dp: jwk.dp,
      dq: jwk.dq,
      qi: jwk.qi
    };
  }

  public async sign(jwk: JWKInterface, data: Uint8Array): Promise<Uint8Array> {
    let signature = await this.driver.sign(
      {
        name: "RSA-PSS",
        saltLength: 0
      },
      await this.jwkToCryptoKey(jwk),
      data
    );

    return new Uint8Array(signature);
  }

  public async hash(data: Uint8Array): Promise<Uint8Array> {
    let digest = await this.driver.digest("SHA-256", data);

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
      n: publicModulus
    };

    const key = await this.jwkToPublicCryptoKey(publicKey);

    return this.driver.verify(
      {
        name: "RSA-PSS",
        saltLength: 0
      },
      key,
      signature,
      data
    );
  }

  private async jwkToCryptoKey(jwk: JWKInterface): Promise<CryptoKey> {
    return this.driver.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        }
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
          name: "SHA-256"
        }
      },
      false,
      ["verify"]
    );
  }

  private detectWebCrypto() {
    if (!window || !window.crypto || !window.crypto.subtle) {
      return false;
    }

    let subtle = window.crypto.subtle;

    if (typeof subtle.generateKey != "function") {
      return false;
    }

    if (typeof subtle.importKey != "function") {
      return false;
    }

    if (typeof subtle.exportKey != "function") {
      return false;
    }

    if (typeof subtle.digest != "function") {
      return false;
    }

    if (typeof subtle.sign != "function") {
      return false;
    }

    return true;
  }

  public async encrypt(
    data: Buffer,
    key: string | Buffer
  ): Promise<Uint8Array> {
    const initialKey = await this.driver.importKey(
      "raw",
      typeof key == "string" ? ArweaveUtils.stringToBuffer(key) : key,
      {
        name: "PBKDF2",
        length: 32
      },
      false,
      ["deriveKey"]
    );

    const salt = ArweaveUtils.stringToBuffer("salt");

    const derivedkey = await this.driver.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      initialKey,
      {
        name: "AES-CBC",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );

    const iv = new Uint8Array(16);

    crypto.getRandomValues(iv);

    const encryptedData = await this.driver.encrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      derivedkey,
      data
    );

    return ArweaveUtils.concatBuffers([iv, encryptedData]);
  }

  public async decrypt(
    encrypted: Buffer,
    key: string | Buffer
  ): Promise<Uint8Array> {
    const initialKey = await this.driver.importKey(
      "raw",
      typeof key == "string" ? ArweaveUtils.stringToBuffer(key) : key,
      {
        name: "PBKDF2",
        length: 32
      },
      false,
      ["deriveKey"]
    );

    const salt = ArweaveUtils.stringToBuffer("salt");

    const derivedkey = await this.driver.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      initialKey,
      {
        name: "AES-CBC",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );

    const iv = encrypted.slice(0, 16);

    const data = await this.driver.decrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      derivedkey,
      encrypted.slice(16)
    );

    // We're just using concat to convert from an array buffer to uint8array
    return ArweaveUtils.concatBuffers([data]);
  }
}
