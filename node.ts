import { Arweave } from "./src/arweave/arweave";
import { NodeCryptoDriver } from "./src/arweave/lib/crypto/node-driver";



export function init(apiConfig: object): Arweave {
    return new Arweave({
        api: apiConfig,
        crypto: new NodeCryptoDriver
    });
}
