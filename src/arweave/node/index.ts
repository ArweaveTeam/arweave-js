import { Arweave } from "../arweave";
import { NodeCryptoDriver } from "../lib/crypto/node-driver";


export function init(): Arweave{
    return new Arweave({
        api: {host: 'wallet-1.nodes.arweave.org'},
        crypto: new NodeCryptoDriver
    });
}
