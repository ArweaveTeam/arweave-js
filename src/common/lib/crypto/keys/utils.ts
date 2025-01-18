
import { KeyType, PrivateKey, PublicKey } from "./interface";
import { RSAPrivateKey, RSAPublicKey } from "./rsa";
import { SECP256K1_IDENTIFIER_SIZE, SECP256k1PrivateKey, SECP256k1PublicKey } from "./secp256k1"

export const fromJWK = async (keyData: JsonWebKey): Promise<PrivateKey> => {
    const format = "jwk";
    switch(keyData.kty) {
        case "EC":
            return SECP256k1PrivateKey.deserialize({format, keyData});
        case "RSA":
            return RSAPrivateKey.deserialize({format, keyData, type: KeyType.RSA_65537});
        default:
            throw new Error(`Unsupported kty ${keyData.kty}`);
    }
}

export const fromIdentifier = async ({identifier}: {identifier: Uint8Array}): Promise<PublicKey> => {
    if (identifier.byteLength % 2 == 0) {
        return RSAPublicKey.deserialize({format: "raw", keyData: identifier, type: KeyType.RSA_65537});
    };
    switch (identifier.byteLength) {
        case SECP256K1_IDENTIFIER_SIZE:
            return SECP256k1PublicKey.fromIdentifier({identifier})
        default:
            throw new Error(`Unknown Identifier`);
    }

};
