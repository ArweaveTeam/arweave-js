import { KeyType, KeyTypeByte, PublicKey, PrivateKey, getInitializationOptions, getSigningParameters } from "./interface";

export class EllipticCurvePrivateKey extends PrivateKey {
    static usages: Array<KeyUsage> = ["sign", "verify"];
    static async new({driver = crypto.subtle, type = KeyType.ED_25519}: {driver?: SubtleCrypto, type?: KeyType} = {driver: crypto.subtle, type: KeyType.ED_25519}): Promise<EllipticCurvePrivateKey> {
        const key = await driver.generateKey(
            getInitializationOptions(type),
            true,
            EllipticCurvePrivateKey.usages
          ) as CryptoKeyPair;
          return new EllipticCurvePrivateKey({type, driver, key})
    }

    static async deserialize({driver = crypto.subtle, format, keyData, type}: {driver?: SubtleCrypto, format: "jwk" | "raw" | "pkcs8" | "spki", keyData: JsonWebKey | Uint8Array, type: KeyType}): Promise<EllipticCurvePrivateKey> {
        if (format === "jwk" && 'key_ops' in keyData) {
            keyData.key_ops = ["sign"];
        }
        const key = await driver.importKey(format as any, keyData as any, getInitializationOptions(type), true, ["sign"]);
        return new EllipticCurvePrivateKey({driver, type, key});
    }

    private readonly driver: SubtleCrypto;
    private readonly key: CryptoKey;
    private publicKey: EllipticCurvePublicKey | null;
    constructor({driver, key, type}: {driver: SubtleCrypto, key: CryptoKeyPair | CryptoKey, type: KeyType}) {
        super({type: type});
        this.driver = driver;

        if ('publicKey' in key) {
            this.key = key.privateKey;
            this.publicKey = new EllipticCurvePublicKey({driver, type, key: key.publicKey});
        } else {
            if (key.type !== "private") {
                throw new Error("Invalid instantiation.")
            }
            this.key = key;
            this.publicKey = null;
        }

    }

    public async sign(payload: Uint8Array): Promise<Uint8Array> {
        return new Uint8Array(await this.driver.sign(
            getSigningParameters(this.type),
            this.key,
            payload
        ));
    }

    public async public(): Promise<EllipticCurvePublicKey> {
        if (this.publicKey !== null) {
            return this.publicKey;
        }
        let keyData = await this.driver.exportKey("spki", this.key);
        this.publicKey = await EllipticCurvePublicKey.deserialize({driver: this.driver, format: "spki", keyData, type: this.type});
        return this.publicKey;
    }

    public async serialize(): Promise<JsonWebKey> {
        return this.driver.exportKey("jwk", this.key);
    }
}

export class EllipticCurvePublicKey extends PublicKey {
    static usages: Array<KeyUsage> = ["verify"];
    static async deserialize({driver = crypto.subtle, format, keyData, type}: {driver?: SubtleCrypto, format: "jwk" | "raw" | "pkcs8" | "spki", keyData: JsonWebKey | ArrayBuffer, type: KeyType}): Promise<EllipticCurvePublicKey> {
        if (format === "jwk" && 'key_ops' in keyData) {
            keyData.key_ops = EllipticCurvePublicKey.usages;
        }
        const key = await driver.importKey(format as any, keyData as any, getInitializationOptions(type), true, EllipticCurvePublicKey.usages);
        return new EllipticCurvePublicKey({driver, type, key});
    }

    private readonly driver: SubtleCrypto;
    private readonly key: CryptoKey;
    constructor({driver, key, type}: {driver: SubtleCrypto, key: CryptoKey, type: KeyType}) {
        if (key.type !== "public") {
            throw new Error("Incorrect instantiation.")
        }
        super({type: type});
        this.driver = driver;
        this.key = key;
    }

    public async verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean> {
        switch(this.type) {
            case KeyType.ED_25519:
                return this.driver.verify(
                    getSigningParameters(this.type),
                    this.key,
                    signature,
                    payload
                );
            default:
                throw new Error(`Unsupported EC KeyType ${this.type}`);
        }
    }

    public async serialize({format = "jwk"}: {format: "jwk" | "raw"} = {format: "jwk"}): Promise<JsonWebKey | Uint8Array> {
        switch(format) {
            case "jwk":
                return this.driver.exportKey("jwk", this.key);
            case "raw":
                return new Uint8Array(await this.driver.exportKey("raw", this.key));
            default:
                throw new Error(`Unsupported format ${format}`);
        }
    }

    public async identifier(): Promise<Uint8Array> {
        const raw = await this.serialize({format: "raw"}) as Uint8Array;
        return new Uint8Array([KeyTypeByte[KeyType.ED_25519], ...raw]);
    }
}
