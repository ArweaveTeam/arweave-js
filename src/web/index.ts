import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import WebCryptoDriver from "./lib/crypto/webcrypto-driver";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
}

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {
  function protocolToDefaultPort(protocol: string) {
    if (protocol == "http") {
      return 80;
    }
    if (protocol == "https") {
      return 443;
    }
  }

  const protocol =
    apiConfig.protocol || window.location.protocol.replace(":", "");
  const host = apiConfig.host || window.location.hostname;
  const port = apiConfig.port || protocolToDefaultPort(protocol);

  return new Arweave({
    api: {
      ...apiConfig,
      host,
      protocol,
      port
    },
    crypto: new WebCryptoDriver()
  });
};

window.Arweave = Arweave;

export * from "./common";
export default Arweave;
