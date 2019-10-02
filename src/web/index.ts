import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import WebCryptoDriver from "./lib/crypto/webcrypto-driver";
import Fetch from "./lib/api/browser-fetch";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
}

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new WebCryptoDriver(),
    fetch: Fetch
  });
};

window.Arweave = Arweave;

export * from "./common";
export default Arweave;
