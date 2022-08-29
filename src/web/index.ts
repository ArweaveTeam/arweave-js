import Arweave from "./common";
import { ApiConfig } from "./lib/api";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
  module globalThis {
    var Arweave: unknown;
  }
}

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  function getDefaultConfig(): {
    protocol: string;
    host: string;
    port: number;
  } {
    const defaults = {
      host: "arweave.net",
      port: 443,
      protocol: "https",
    };

    if (
      typeof location !== "object" ||
      !location.protocol ||
      !location.hostname
    ) {
      return defaults;
    }

    // window.location.protocol has a trailing colon (http:, https:, file: etc)
    const currentProtocol = location.protocol.replace(":", "");
    const currentHost = location.hostname;
    const currentPort = location.port
      ? parseInt(location.port)
      : currentProtocol == "https"
      ? 443
      : 80;

    const isLocal =
      ["localhost", "127.0.0.1"].includes(currentHost) ||
      currentProtocol == "file";

    // If we're running in what looks like a local dev environment
    // then default to using arweave.net
    if (isLocal) {
      return defaults;
    }

    return {
      host: currentHost,
      port: currentPort,
      protocol: currentProtocol,
    };
  }

  const defaultConfig = getDefaultConfig();

  const protocol = apiConfig.protocol || defaultConfig.protocol;
  const host = apiConfig.host || defaultConfig.host;
  const port = apiConfig.port || defaultConfig.port;

  return new Arweave({
    ...apiConfig,
    host,
    protocol,
    port,
  });
};

if (typeof globalThis === "object") {
  globalThis.Arweave = Arweave;
} else if (typeof self === "object") {
  self.Arweave = Arweave;
}

export * from "./common";
export default Arweave;
