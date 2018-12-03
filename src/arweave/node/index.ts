import { Arweave } from "../arweave";
import { NodeCryptoDriver } from "../lib/crypto/node-driver";


export function init(apiConfig: object): Arweave{
    return new Arweave({
        api: apiConfig,
        crypto: new NodeCryptoDriver
    });
}
