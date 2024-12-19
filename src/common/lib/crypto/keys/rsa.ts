import { KeyType, PublicKey, PrivateKey, getInitializationOptions, getSigningParameters } from "./interface";


export class RSAPrivateKey extends PrivateKey {
    static usages: Array<KeyUsage> = ["sign", "verify"];
    static async new({driver = crypto.subtle, type = KeyType.RSA_65537}: {driver?: SubtleCrypto, type?: KeyType} = {driver: crypto.subtle, type: KeyType.RSA_65537}): Promise<RSAPrivateKey> {
        const key = await driver.generateKey(
            getInitializationOptions(type),
            true,
            RSAPrivateKey.usages
          ) as CryptoKeyPair;
          return new RSAPrivateKey({type, driver, key})
    }

    static async deserialize({driver = crypto.subtle, format, keyData, type}: {driver?: SubtleCrypto, format: "jwk" | "raw" | "pkcs8" | "spki", keyData: JsonWebKey | Uint8Array, type: KeyType}): Promise<RSAPrivateKey> {
        const key = await driver.importKey(format as any, keyData as any, getInitializationOptions(type), true, RSAPrivateKey.usages);
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
    
    public async sign(payload: Uint8Array): Promise<Uint8Array> {
        return new Uint8Array(await this.driver.sign(
            getSigningParameters(this.type),
            this.key,
            payload
        ));
    }

    public async public(): Promise<RSAPublicKey> {
        if (this.publicKey !== null) {
            return this.publicKey;
        }
        let keyData = await this.driver.exportKey("spki", this.key);
        this.publicKey = await RSAPublicKey.deserialize({driver: this.driver, format: "spki", keyData, type: this.type});
        return this.publicKey;
    }

    public async serialize(): Promise<JsonWebKey> {
        return this.driver.exportKey("jwk", this.key);
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
        const key = await driver.importKey(format as any, keyData as any, getInitializationOptions(type), true, RSAPublicKey.usages);
        return new RSAPublicKey({driver, type, key});
    }

    public async verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean> {
        switch(this.type) {
            case KeyType.RSA_65537: {
                let result = false;
                for (let s of [0, 32, maxSaltSize(this.key)]) {
                    if (result = await this.driver.verify(
                        {name: "RSA-PSS", saltLength: s},
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
