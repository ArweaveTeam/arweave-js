import { Arweave } from "./arweave/arweave";
import { ApiConfig } from "./arweave/lib/api";
import { WebCryptoDriver } from "./arweave/lib/crypto/webcrypto-driver";

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
