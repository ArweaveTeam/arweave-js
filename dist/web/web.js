import { Arweave } from "./arweave/arweave";
import { WebCryptoDriver } from "./arweave/lib/crypto/webcrypto-driver";
window.arweave = {
    init(apiConfig) {
        return new Arweave({
            api: apiConfig,
            crypto: new WebCryptoDriver
        });
    }
};
//# sourceMappingURL=web.js.map