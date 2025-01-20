import { KeyType, PublicKey, PrivateKey, getInitializationOptions, getSigningParameters, SerializationParams, VerifyingParams, SigningParams } from "./interface";
import { b64UrlToBuffer, bufferTob64Url } from "../../utils";

export class RSAPrivateKey extends PrivateKey {
    static usages: Array<KeyUsage> = ["sign", "verify"];
    static async new({driver = crypto.subtle, type = KeyType.RSA_65537, modulusLength}: {driver?: SubtleCrypto, type?: KeyType, modulusLength?: number} = {driver: crypto.subtle, type: KeyType.RSA_65537}): Promise<RSAPrivateKey> {
        if (modulusLength !== undefined) {
            if (modulusLength < 32 * 8 || modulusLength > 512 * 8) {
                throw new Error("modulusLength must be between 256 and 4096.");
            }
            if ((modulusLength & (modulusLength - 1)) !== 0) {
                throw new Error("Modulus length must be a power of 2.");
            }
        } else {
            modulusLength = 4096;
        }
        const key = await driver.generateKey(
            {...getInitializationOptions(type) as RsaHashedKeyGenParams, modulusLength},
            true,
            RSAPrivateKey.usages
          ) as CryptoKeyPair;
          return new RSAPrivateKey({type, driver, key})
    }

    static async deserialize({driver = crypto.subtle, format, keyData, type}: {driver?: SubtleCrypto, format: "jwk" | "raw" | "pkcs8" | "spki", keyData: JsonWebKey | Uint8Array, type: KeyType}): Promise<RSAPrivateKey> {
        const key = await driver.importKey(format as any, keyData as any, getInitializationOptions(type), true, ["sign"]);
        return new RSAPrivateKey({driver, type, key});
    }

    private readonly driver: SubtleCrypto;
    private readonly key: CryptoKey;
    private publicKey: RSAPublicKey | null;
    constructor({driver, key, type}: {driver: SubtleCrypto, key: CryptoKeyPair | CryptoKey, type: KeyType}) {
        super({type: type});
        this.driver = driver;

        // initialized with CryptoKeyPair
        if ('publicKey' in key) {
            this.key = key.privateKey;
            this.publicKey = new RSAPublicKey({driver, type, key: key.publicKey});
        } else {
            if (key.type !== "private") {
                throw new Error("Invalid instantiation.")
            }
            this.key = key;
            this.publicKey = null;
        }

    }

    public async sign({payload}: SigningParams, saltLength?: number): Promise<Uint8Array> {
        let signingOptions = getSigningParameters(this.type) as RsaPssParams;
        if (saltLength !== undefined) {
            signingOptions = {...signingOptions, saltLength};
        }
        return new Uint8Array(await this.driver.sign(
            signingOptions,
            this.key,
            payload
        ));
    }

    public async public(): Promise<RSAPublicKey> {
        if (this.publicKey !== null) {
            return this.publicKey;
        }
        let keyData = await this.driver.exportKey("jwk", this.key);
        delete keyData.d;
        delete keyData.dp;
        delete keyData.dq;
        delete keyData.q;
        delete keyData.qi;
        delete keyData.key_ops;
        this.publicKey = await RSAPublicKey.deserialize({driver: this.driver, format: "jwk", keyData, type: this.type});
        return this.publicKey;
    }

    public async serialize({format}: SerializationParams<"jwk">): Promise<JsonWebKey>;
    public async serialize({format}: SerializationParams): Promise<JsonWebKey | Uint8Array> {
        switch (format) {
            case "jwk":
                let jwk = await this.driver.exportKey("jwk", this.key);
                delete jwk.ext;
                delete jwk.key_ops;
                delete jwk.alg;
                return jwk;
            default:
                throw new Error(`Format ${format} no suppoerted`);
        }
    }
}

export class RSAPublicKey extends PublicKey {
    static usages: Array<KeyUsage> = ["verify"];
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

    static async deserialize({driver = crypto.subtle, format, keyData, type}: {driver?: SubtleCrypto, format: "jwk" | "raw" | "pkcs8" | "spki", keyData: JsonWebKey | ArrayBuffer, type: KeyType}): Promise<RSAPublicKey> {
        let k: JsonWebKey;
        if (format === "raw") {
            k = {
                kty: "RSA",
                e: "AQAB",
                n: bufferTob64Url(keyData as Uint8Array),
                key_ops: RSAPublicKey.usages
            };
            format = "jwk";
        } else {
            k = {...keyData as JsonWebKey, key_ops: RSAPublicKey.usages};
        }
        const key = await driver.importKey(format as any, k as any, getInitializationOptions(type), true, RSAPublicKey.usages);
        return new RSAPublicKey({driver, type, key});
    }

    public async verify({payload, signature}: VerifyingParams): Promise<boolean> {
        switch(this.type) {
            case KeyType.RSA_65537: {
                let result = false;
                for (let s of [0, 32, maxSaltSize(this.key)]) {
                    if (result = await this.driver.verify(
                        {...getSigningParameters(this.type) as RsaPssParams, saltLength: s},
                        this.key,
                        signature,
                        payload
                    )){
                        break;
                    }
                }
                return result;
            }
            default:
                throw new Error(`Unsupported RSA KeyType ${this.type}`);
        }
    }

    public async serialize({format}: SerializationParams<"jwk">): Promise<JsonWebKey>;
    public async serialize({format}: SerializationParams<"raw">): Promise<Uint8Array>;
    public async serialize({format}: SerializationParams): Promise<JsonWebKey | Uint8Array> {
        const jwk = await this.driver.exportKey("jwk", this.key);
        switch(format) {
            case "jwk":
                delete jwk.key_ops;
                delete jwk.ext;
                delete jwk.alg;
                return jwk;
            case "raw":
                return b64UrlToBuffer(jwk.n!);
            default:
                throw new Error(`Unsupported format ${format}`);
        }
    }

    public async identifier(): Promise<Uint8Array> {
        return this.serialize({format: "raw"});
    }

}

const maxSaltSize = (key: CryptoKey): number => {
    const alg = key.algorithm as RsaHashedKeyGenParams;
    return  Math.ceil((alg.modulusLength - 1) / 8) - getDigestSize(alg.hash) - 2;
};

const getDigestSize = (hashName: Algorithm | string) => {
    let name: string;
    if (typeof hashName !== "string") {
        name = hashName.name;
    } else {
        name = hashName;
    }
    switch(name) {
        case "SHA-256":
            return 32;
        default:
            throw new Error(`Unsupported Hash Algorithm for RSA Key ${hashName}`);
    }
}
