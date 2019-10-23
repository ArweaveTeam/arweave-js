import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import WebCryptoDriver from "./lib/crypto/webcrypto-driver";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
}

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {

  function getDefaultConfig(): {
    protocol: string;
    host: string;
    port: number;
  } {
    // window.location.protocol has a trailing colon (http:, https:, file: etc)
    const currentProtocol = window.location.protocol.replace(":", "");
    const currentHost = window.location.hostname;

    const isLocal =
      ["localhost", "127.0.0.1"].includes(currentHost) ||
      currentProtocol == "file";

    // If we're running in what looks like a local dev environment
    // then default to using arweave.net
    if (isLocal) {
      return {
        host: "arweave.net",
        port: 443,
        protocol: "https"
      };
    }

    return {
      host: currentHost,
      port: currentProtocol == "https" ? 443 : 80,
      protocol: currentProtocol
    };
  }

  const defaultConfig  = getDefaultConfig();

  const protocol = apiConfig.protocol || defaultConfig.protocol;
  const host = apiConfig.host || defaultConfig.host;
  const port = apiConfig.port || defaultConfig.port;

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
