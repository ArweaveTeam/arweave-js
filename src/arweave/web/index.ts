import { Arweave } from "../arweave";
import { WebCryptoDriver } from "../lib/crypto/webcrypto-driver";

(<any>window).arweave = {
    init(): Arweave{
        return new Arweave({
            api: {host: 'wallet-1.nodes.arweave.org'},
            crypto: new WebCryptoDriver
        });
    }
};