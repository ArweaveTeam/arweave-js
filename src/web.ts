import { Arweave } from "./arweave/arweave";
import { WebCryptoDriver } from "./arweave/lib/crypto/webcrypto-driver";


(<any>window).arweave = {
    init(apiConfig: object): Arweave {
        return new Arweave({
            api: apiConfig,
            crypto: new WebCryptoDriver
        });
    }
};
