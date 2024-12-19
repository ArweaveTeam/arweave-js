export enum KeyType {
    RSA_65537 = "rsa_65537",
    EC_SECP256K1 = "ec_secp256k1",
    ED_25519 = "ed_25519",
};
  
export const KeyTypeByte = {
    [KeyType.RSA_65537]: null,
    [KeyType.EC_SECP256K1]: 1,
    [KeyType.ED_25519]: 2
}

export abstract class PrivateKey {
    public readonly type: KeyType;

    constructor({type}: {type: KeyType}) {
        this.type = type;
    }
    
    static async new(_parameters: any): Promise<PrivateKey> {
        throw new Error(`PrivateKey does not implement instantiation interface.`);
    }
    static async deserialize(_parameters: any): Promise<PrivateKey> {
        throw new Error(`PrivateKey does not implement deserialization interface.`);
    }

    serialize(): Promise<JsonWebKey> {
        throw new Error(`Key ${this.type} does not provide serialization interface.`);
    }
    decrypt(_secret: Uint8Array): Promise<Uint8Array> {
        throw new Error(`PrivateKey ${this.type} does not provide encyrption interface.`);
    }
    sign(_payload: Uint8Array): Promise<Uint8Array> {
        throw new Error(`PrivateKey ${this.type} does not provide signing interface.`);
    }
    public(): Promise<PublicKey> {
        throw new Error(`PrivateKey ${this.type} does not provide a public side interface.`);
    };
}

export abstract class PublicKey {
    public readonly type: KeyType;

    constructor({type}: {type: KeyType}) {
        this.type = type;
    }
    
    static async deserialize(_parameters: any): Promise<PublicKey> {
        throw new Error(`PublicKey does not implement deserialization interface.`);
    }
    serialize(): Promise<JsonWebKey> {
        throw new Error(`PublicKey ${this.type} does not provide serialization interface.`);
    }
    encrypt(_payload: Uint8Array): Promise<Uint8Array> {
        throw new Error(`PublicKey ${this.type} does not provide encyrption interface.`);
    }
    verify(_payload: Uint8Array, _signature: Uint8Array): Promise<boolean> {
        throw new Error(`PublicKey ${this.type} does not provide signing interface.`);
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
                },
                modulusLength: 4096
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
