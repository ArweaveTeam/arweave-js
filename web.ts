import { Arweave } from "./src/arweave/arweave";
import { WebCryptoDriver } from "./src/arweave/lib/crypto/webcrypto-driver";


(<any>window).arweave = {
    init(apiConfig: object): Arweave {
        return new Arweave({
            api: apiConfig,
            crypto: new WebCryptoDriver
        });
    }
};
