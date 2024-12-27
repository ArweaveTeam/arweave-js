import { Secp256k1, initWasmSecp256k1 } from "@solar-republic/wasm-secp256k1";
import { KeyType, KeyTypeByte, PrivateKey, PublicKey, SerializationParams } from "./interface";
import { bufferTob64Url, b64UrlToBuffer } from "../../utils";

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

    public async public(): Promise<SECP256k1PublicKey> {
        return this.publicKey;
    }

    public async serialize({format}: SerializationParams<"jwk">): Promise<JsonWebKey>;
    public async serialize({format}: SerializationParams): Promise<JsonWebKey | Uint8Array> {
        switch (format) {
            case "jwk":
                return  {
                    ...(await this.publicKey.serialize({format: "jwk"})),
                    d: bufferTob64Url(this.key),
                };
            default:
                throw new Error(`Format ${format} no suppoerted`);
        }
    }

    public async sign({payload}: {payload: Uint8Array}): Promise<Uint8Array> {
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

    public async verify({payload, signature}: {payload: Uint8Array, signature: Uint8Array}): Promise<boolean> {
        return this.driver.verify(signature, payload, this.key);
    }

    public async serialize({format}: SerializationParams<"jwk">): Promise<JsonWebKey>;
    public async serialize({format}: SerializationParams<"raw">): Promise<Uint8Array>;
    public async serialize({format}: SerializationParams): Promise<JsonWebKey | Uint8Array> {
        switch(format) {
            case "jwk":
                return  {
                    kty: "EC",
                    crv: "secp256k1",
                    x: bufferTob64Url(this.key.slice(1, 33)),
                    y: bufferTob64Url(this.key.slice(33))
                };
            case "raw":
                const x = this.key.slice(1, 33);
                const y = this.key.slice(33);
                const raw_compressed = new Uint8Array(33);
                if ((y[31] & 1) === 1) {
                    raw_compressed[0] = 3;
                } else {
                    raw_compressed[0] = 2;
                }
                raw_compressed.set(x, 1);
                return raw_compressed;
            default:
                throw new Error(`Unsupported format ${format}`);
        }
    }

    public async identifier(): Promise<Uint8Array> {
        const raw = await this.serialize({format: "raw"});
        return new Uint8Array([KeyTypeByte[KeyType.EC_SECP256K1], ...raw, 0]);
    }
}
