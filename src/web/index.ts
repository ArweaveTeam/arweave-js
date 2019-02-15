import { Arweave } from "./common";
import { ApiConfig } from "./lib/api";
import { WebCryptoDriver } from "./lib/crypto/webcrypto-driver";

export * from "./common";

interface GlobalArweave {
  init(apiConfig: ApiConfig): Arweave;
}

declare global {
  interface Window {
    Arweave: GlobalArweave;
  }
}

window.Arweave = {
  init(apiConfig: ApiConfig): Arweave {
    return new Arweave({
      api: apiConfig,
      crypto: new WebCryptoDriver()
    });
  }
};

export function init(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new WebCryptoDriver()
  });
}
