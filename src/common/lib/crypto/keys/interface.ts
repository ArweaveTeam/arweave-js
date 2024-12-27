import { Secp256k1 } from "@solar-republic/wasm-secp256k1";

export enum KeyType {
    RSA_65537 = "rsa_65537",
    EC_SECP256K1 = "ec_secp256k1",
    ED_25519 = "ed_25519",
};

export const KeyTypeByte = {
    [KeyType.RSA_65537]: null,
    [KeyType.EC_SECP256K1]: 2,
    [KeyType.ED_25519]: 3
}

export type Format = "jwk" | "raw";

export interface SerializationParams<T extends Format = Format> {
    format: T;
}

export interface SigningParams {
    payload: Uint8Array;
}

export interface VerifyingParams {
    payload: Uint8Array;
    signature: Uint8Array;
}

export interface EncryptionParams {
    secret: Uint8Array;
}

export interface DecryptionParams {
    payload: Uint8Array;
}

export abstract class PrivateKey {
    public readonly type: KeyType;

    constructor({type}: {type: KeyType}) {
        this.type = type;
    }
    static async new(_: any): Promise<PrivateKey> {
        throw new Error(`PrivateKey does not implement instantiation interface.`);
    }
    static async deserialize(_: any): Promise<PrivateKey> {
        throw new Error(`PrivateKey does not implement deserialization interface.`);
    }
    abstract serialize(params: SerializationParams): Promise<JsonWebKey | Uint8Array>;
    abstract sign(params: SigningParams): Promise<Uint8Array>;
    abstract public(): Promise<PublicKey>;
    public async decrypt(_: DecryptionParams): Promise<Uint8Array> {
        throw new Error(`PrivateKey ${this.type} does not provide decription interface.`);
    }
}

export abstract class PublicKey {
    public readonly type: KeyType;
    constructor({type}: {type: KeyType}) {
        this.type = type;
    }
    static async deserialize(_: any): Promise<PublicKey> {
        throw new Error(`PublicKey does not implement deserialization interface.`);
    }
    abstract serialize(params: SerializationParams): Promise<JsonWebKey | Uint8Array>;
    abstract verify(params: VerifyingParams): Promise<boolean>;
    abstract identifier(): Promise<Uint8Array>;
    public async encrypt(_: EncryptionParams): Promise<Uint8Array> {
        throw new Error(`PrivateKey ${this.type} does not provide encyrption interface.`);
    }
}

export const getInitializationOptions = (type: KeyType): AlgorithmIdentifier | RsaHashedKeyGenParams | EcKeyGenParams | "Ed25519" => {
    switch(type) {
        case KeyType.RSA_65537:
            return {
                name: "RSA-PSS",
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-256"
                }
            };
        case KeyType.ED_25519:
            return "Ed25519";
        default:
            throw new Error(`Unsupported RSA KeyType ${type}`);
    }
}

export const getSigningParameters = (type: KeyType): AlgorithmIdentifier | RsaPssParams | EcdsaParams => {
    switch(type) {
        case KeyType.RSA_65537:
            return {
                name: "RSA-PSS",
                saltLength: 32,
            };
        case KeyType.ED_25519:
            return "Ed25519";
        default:
            throw new Error(`Unsupported RSA KeyType ${type}`);
    }
}
