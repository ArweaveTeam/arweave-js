import { Secp256k1, initWasmSecp256k1 } from "@solar-republic/wasm-secp256k1";
import { KeyType, PrivateKey, PublicKey } from "./interface";
import { bufferTob64Url, b64UrlToBuffer } from "lib/utils";

// TODO: build wasm module and internalize the dependency
export const initializeDriver = async () => {
    return await initWasmSecp256k1()
};

const ENGINE = initializeDriver();

export class SECP256k1PrivateKey extends PrivateKey {
    static usages: Array<KeyUsage> = ["sign", "verify"];
    static async new({driver = null}: {driver?: Secp256k1 | null} = {driver: null}): Promise<SECP256k1PrivateKey> {
        if (driver === null) {
            driver = (await ENGINE);
        }
        const key = driver.gen_sk();
        return new SECP256k1PrivateKey({driver, key});
    }

    static async deserialize({driver = null, format, keyData}: {driver?: Secp256k1 | null, format: "jwk" | "raw", keyData: JsonWebKey | Uint8Array}): Promise<SECP256k1PrivateKey> {
        if (driver === null) {
            driver = (await ENGINE);
        }
        if (format === "jwk") {
            const k = keyData as JsonWebKey;
            if (k.kty !== "EC" || k.crv !== "secp256k1" || !('d' in k)) {
                throw new Error("Invalid JWK formatted secp256k1 PrivateKey.");
            }
            const key = b64UrlToBuffer(k.d!);
            if (key.length !== 32) {
                throw new Error(`Invalid secp256k1 key size ${key.length}`);
            }
            return new SECP256k1PrivateKey({driver, key});
        } else {
            const key = keyData as Uint8Array;
            if (key.length !== 32) {
                throw new Error(`Invalid secp256k1 key size ${key.length}`);
            }
            return new SECP256k1PrivateKey({driver, key});
        }   
    }

    private readonly driver: Secp256k1;
    private readonly key: Uint8Array;
    private publicKey: SECP256k1PublicKey;
    constructor({driver, key}: {driver: Secp256k1, key: Uint8Array}) {
        super({type: KeyType.EC_SECP256K1});
        this.driver = driver;
        this.key = key;
        this.publicKey = new SECP256k1PublicKey({driver, key: driver.sk_to_pk(key, true)});
    }

    public async public(): Promise<PublicKey> {
        return this.publicKey;
    }

    public async serialize(): Promise<JsonWebKey> {
        return  {
            ...(await this.publicKey.serialize()),
            d: bufferTob64Url(this.key),
            key_ops: SECP256k1PrivateKey.usages,
        };
    }

    public async sign(payload: Uint8Array): Promise<Uint8Array> {
        const[signature, _recovery] = this.driver.sign(this.key, payload);
        return signature;
    }
}

export class SECP256k1PublicKey extends PublicKey {
    static usages: Array<KeyUsage> = ["verify"];
    static async deserialize({driver = null, format, keyData}: {driver?: Secp256k1 | null, format: "jwk" | "raw", keyData: JsonWebKey | Uint8Array}): Promise<SECP256k1PublicKey> {
        if (driver === null) {
            driver = (await ENGINE);
        }
        if (format === "jwk") {
            const k = keyData as JsonWebKey;
            if (k.kty !== "EC" || k.crv !== "secp256k1" || !('x' in k) || !('y' in k)) {
                throw new Error("Invalid JWK formatted secp256k1 PublicKey.");
            }
            const x = b64UrlToBuffer(k.x!);
            const y = b64UrlToBuffer(k.y!);
            if (x.length !== 32 || y.length !== 32) {
                throw new Error(`Invalid secp256k1 PublicKey coordinate size:  X: ${x.length}, Y: ${y.length}`);
            }
            return new SECP256k1PublicKey({driver, key: Uint8Array.from([0x04, ...x, ...y])});
        } else {
            const key = keyData as Uint8Array;
            if (key.length !== 65) {
                throw new Error(`Invalid secp256k1 PublicKey size ${key.length}`);
            }
            return new SECP256k1PublicKey({driver, key});
        }
    }

    private readonly driver: Secp256k1;
    private readonly key: Uint8Array;
    constructor({driver, key}: {driver: Secp256k1, key: Uint8Array}) {
        if (key.length !== 65 || key[0] !== 0x04) {
            throw new Error('Only uncompressed format accepted for initialization!');
        }
        super({type: KeyType.EC_SECP256K1});
        this.driver = driver;
        this.key = key;
    }

    public async verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean> {
        return this.driver.verify(signature, payload, this.key);
    }

    public async serialize(): Promise<JsonWebKey> {
        return  {
            kty: "EC",
            crv: "secp256k1",
            x: bufferTob64Url(this.key.slice(1, 33)), 
            y: bufferTob64Url(this.key.slice(33)),
            key_ops: SECP256k1PublicKey.usages
        };
    }
}