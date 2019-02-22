import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import WebCryptoDriver from "./lib/crypto/webcrypto-driver";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
}

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new WebCryptoDriver()
  });
};

window.Arweave = Arweave;

export * from "./common";
export default Arweave;
