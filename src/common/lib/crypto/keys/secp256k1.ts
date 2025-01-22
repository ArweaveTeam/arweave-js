import { ByteLens, initWasmSecp256k1 } from "@arweave/wasm-secp256k1";
import type { Secp256k1, SignatureAndRecovery } from "@arweave/wasm-secp256k1";
import {
  KeyType,
  PrivateKey,
  PublicKey,
  SerializationParams,
  SigningParams,
  VerifyingParams,
} from "./interface";
import { bufferTob64Url, b64UrlToBuffer } from "../../utils";

export const SECP256K1_IDENTIFIER_SIZE = ByteLens.PUBLIC_KEY_COMPRESSED;
const EC_POINT_LENGTH = (ByteLens.PUBLIC_KEY_UNCOMPRESSED - 1) / 2;
const UNCOMPRESSED_PREFIX = 0x04;
const COMPRESSED_PREFIXES = [0x02, 0x03];

export const initializeDriver = async () => {
  return await initWasmSecp256k1();
};

const ENGINE = initializeDriver();

export class SECP256k1PrivateKey extends PrivateKey {
  static usages: Array<KeyUsage> = ["sign", "verify"];
  static async new(
    { driver = null }: { driver?: Secp256k1 | null } = { driver: null }
  ): Promise<SECP256k1PrivateKey> {
    if (driver === null) {
      driver = await ENGINE;
    }
    const key = driver.gen_sk();
    return new SECP256k1PrivateKey({ driver, key });
  }

  static async deserialize({
    driver = null,
    format,
    keyData,
  }: {
    driver?: Secp256k1 | null;
    format: "jwk" | "raw";
    keyData: JsonWebKey | Uint8Array;
  }): Promise<SECP256k1PrivateKey> {
    if (driver === null) {
      driver = await ENGINE;
    }
    if (format === "jwk") {
      const k = keyData as JsonWebKey;
      if (k.kty !== "EC" || k.crv !== "secp256k1" || !("d" in k)) {
        throw new Error("Invalid JWK formatted secp256k1 PrivateKey.");
      }
      const key = b64UrlToBuffer(k.d!);
      if (key.byteLength !== ByteLens.PRIVATE_KEY) {
        throw new Error(`Invalid secp256k1 key size ${key.byteLength}`);
      }
      return new SECP256k1PrivateKey({ driver, key });
    } else {
      const key = keyData as Uint8Array;
      if (key.byteLength !== ByteLens.PRIVATE_KEY) {
        throw new Error(`Invalid secp256k1 key size ${key.byteLength}`);
      }
      return new SECP256k1PrivateKey({ driver, key });
    }
  }

  private readonly driver: Secp256k1;
  private readonly key: Uint8Array;
  private publicKey: SECP256k1PublicKey;
  constructor({ driver, key }: { driver: Secp256k1; key: Uint8Array }) {
    super({ type: KeyType.EC_SECP256K1 });
    this.driver = driver;
    this.key = key;
    this.publicKey = new SECP256k1PublicKey({
      driver,
      key: driver.sk_to_pk(key, true),
    });
  }

  public async public(): Promise<SECP256k1PublicKey> {
    return this.publicKey;
  }

  public async serialize({
    format,
  }: SerializationParams<"jwk">): Promise<JsonWebKey>;
  public async serialize({
    format,
  }: SerializationParams): Promise<JsonWebKey | Uint8Array> {
    switch (format) {
      case "jwk":
        return {
          ...(await this.publicKey.serialize({ format: "jwk" })),
          d: bufferTob64Url(this.key),
        };
      default:
        throw new Error(`Format ${format} no suppoerted`);
    }
  }

  public async sign({
    payload,
    isDigest = false,
  }: SigningParams): Promise<Uint8Array> {
    let digest = payload;
    if (isDigest == false) {
      digest = new Uint8Array(await crypto.subtle.digest("SHA-256", payload));
    } else if (digest.byteLength !== ByteLens.MSG_HASH) {
      return Promise.reject(`Invalid digest size ${digest.byteLength}`);
    }
    const [signature, recovery]: SignatureAndRecovery = this.driver.sign(
      this.key,
      digest
    );
    const recovarableSignature = new Uint8Array(ByteLens.ECDSA_SIG_RECOVERABLE);
    recovarableSignature.set(signature, 0);
    recovarableSignature.set([recovery], 64);
    return recovarableSignature;
  }
}

export class SECP256k1PublicKey extends PublicKey {
  static usages: Array<KeyUsage> = ["verify"];
  static async fromIdentifier({
    identifier,
  }: {
    identifier: Uint8Array;
  }): Promise<SECP256k1PublicKey> {
    if (identifier.byteLength !== SECP256K1_IDENTIFIER_SIZE) {
      throw new Error("Invalid identifier length");
    }
    const rawCompressed = Uint8Array.from(identifier);
    return SECP256k1PublicKey.deserialize({
      format: "raw",
      keyData: rawCompressed,
    });
  }
  static async deserialize({
    driver = null,
    format,
    keyData,
  }: {
    driver?: Secp256k1 | null;
    format: "jwk" | "raw";
    keyData: JsonWebKey | Uint8Array;
  }): Promise<SECP256k1PublicKey> {
    if (driver === null) {
      driver = await ENGINE;
    }
    if (format === "jwk") {
      const k = keyData as JsonWebKey;
      if (
        k.kty !== "EC" ||
        k.crv !== "secp256k1" ||
        !("x" in k) ||
        !("y" in k)
      ) {
        throw new Error("Invalid JWK formatted secp256k1 PublicKey.");
      }
      const x = b64UrlToBuffer(k.x!);
      const y = b64UrlToBuffer(k.y!);
      if (
        x.byteLength !== EC_POINT_LENGTH ||
        y.byteLength !== EC_POINT_LENGTH
      ) {
        throw new Error(
          `Invalid secp256k1 PublicKey coordinate size:  X: ${x.byteLength}, Y: ${y.byteLength}`
        );
      }
      return new SECP256k1PublicKey({
        driver,
        key: Uint8Array.from([UNCOMPRESSED_PREFIX, ...x, ...y]),
      });
    } else {
      const key = keyData as Uint8Array;
      if (
        ![
          ByteLens.PUBLIC_KEY_COMPRESSED,
          ByteLens.PUBLIC_KEY_UNCOMPRESSED,
        ].includes(key.byteLength)
      ) {
        throw new Error(`Invalid secp256k1 PublicKey size ${key.byteLength}`);
      }
      // TODO: need to transform to uncompressed key size
      return new SECP256k1PublicKey({ driver, key });
    }
  }

  static async recover({
    driver = null,
    payload,
    signature,
    isDigest = false,
  }: {
    driver?: Secp256k1 | null;
    payload: Uint8Array;
    signature: Uint8Array;
    isDigest: boolean;
  }): Promise<SECP256k1PublicKey> {
    if (driver === null) {
      driver = await ENGINE;
    }
    if (signature.byteLength !== ByteLens.ECDSA_SIG_RECOVERABLE) {
      return Promise.reject(
        `Invaldi signature length ${signature.byteLength} needs to by ${ByteLens.ECDSA_SIG_RECOVERABLE}`
      );
    }
    let digest = payload;
    if (isDigest === false) {
      digest = new Uint8Array(await crypto.subtle.digest("SHA-256", payload));
    } else if (digest.byteLength !== ByteLens.MSG_HASH) {
      return Promise.reject(`Invalid digest size ${digest.byteLength}`);
    }
    const compactSignature = signature.slice(0, ByteLens.ECDSA_SIG_COMPACT);
    const recoveryId = signature[signature.byteLength - 1];
    const uncompressedKey = driver.recover(
      compactSignature,
      digest,
      recoveryId,
      true
    );
    return SECP256k1PublicKey.deserialize({
      driver,
      format: "raw",
      keyData: uncompressedKey,
    });
  }

  private readonly driver: Secp256k1;
  private readonly key: Uint8Array;
  constructor({ driver, key }: { driver: Secp256k1; key: Uint8Array }) {
    if (key.byteLength === ByteLens.PUBLIC_KEY_UNCOMPRESSED) {
      if (key[0] !== UNCOMPRESSED_PREFIX) {
        throw new Error("Unaccepted uncompressed format prefix!");
      }
    } else {
      throw new Error(`Incorrect public key size: ${key.byteLength}`);
    }
    super({ type: KeyType.EC_SECP256K1 });
    this.driver = driver;
    this.key = key;
  }

  public async verify({
    payload,
    signature,
    isDigest = false,
  }: VerifyingParams): Promise<boolean> {
    if (signature.byteLength !== ByteLens.ECDSA_SIG_RECOVERABLE) {
      return Promise.reject(
        `Invaldi signature length ${signature.byteLength} needs to by ${ByteLens.ECDSA_SIG_RECOVERABLE}`
      );
    }
    const compactSignature = signature.slice(0, ByteLens.ECDSA_SIG_COMPACT);
    let digest = payload;
    if (isDigest === false) {
      digest = new Uint8Array(await crypto.subtle.digest("SHA-256", payload));
    } else if (digest.byteLength !== ByteLens.MSG_HASH) {
      return Promise.reject(`Invalid digest size ${digest.byteLength}`);
    }
    return this.driver.verify(compactSignature, digest, this.key);
  }

  public async serialize({
    format,
  }: SerializationParams<"jwk">): Promise<JsonWebKey>;
  public async serialize({
    format,
  }: SerializationParams<"raw">): Promise<Uint8Array>;
  public async serialize({
    format,
  }: SerializationParams): Promise<JsonWebKey | Uint8Array> {
    switch (format) {
      case "jwk":
        return {
          kty: "EC",
          crv: "secp256k1",
          x: bufferTob64Url(this.key.slice(1, 33)),
          y: bufferTob64Url(this.key.slice(33)),
        };
      case "raw":
        const x = this.key.slice(1, 33);
        const y = this.key.slice(33);
        const rawCompressed = new Uint8Array(33);
        if ((y[31] & 1) === 1) {
          rawCompressed[0] = COMPRESSED_PREFIXES[1];
        } else {
          rawCompressed[0] = COMPRESSED_PREFIXES[0];
        }
        rawCompressed.set(x, 1);
        return rawCompressed;
      default:
        throw new Error(`Unsupported format ${format}`);
    }
  }

  public async identifier(): Promise<Uint8Array> {
    return new Uint8Array([...(await this.serialize({ format: "raw" }))]);
  }
}
