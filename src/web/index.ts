import DefaultArweave, { BaseArweave } from "./common";
import { ApiConfig } from "./lib/api";
import { getDefaultConfig } from "./net-config";

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
  module globalThis {
    var Arweave: unknown;
  }
}

export class WebArweave extends BaseArweave {
  constructor(apiConfig: ApiConfig = {}) {
    super(apiConfig);
  }

  public static init(apiConfig: ApiConfig = {}): WebArweave {
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
    return new WebArweave({
      ...apiConfig,
      ...defaults,
    });
  }

  // window.location.protocol has a trailing colon (http:, https:, file: etc)
  const locationProtocol = location.protocol.replace(":", "");
  const locationHost = location.hostname;
  const locationPort = location.port
    ? parseInt(location.port)
    : locationProtocol == "https"
    ? 443
    : 80;

  const defaultConfig = getDefaultConfig(locationProtocol, locationHost);

  const protocol = apiConfig.protocol || defaultConfig.protocol;
  const host = apiConfig.host || defaultConfig.host;
  const port = apiConfig.port || defaultConfig.port || locationPort;

    return new WebArweave({
       ...apiConfig,
      host,
      protocol,
      port,
    });
  }
}

if (typeof globalThis === "object") {
  globalThis.Arweave = WebArweave;
} else if (typeof self === "object") {
  self.Arweave = WebArweave;
}

// for backwards compatibility
DefaultArweave.init = WebArweave.init;
export * from "./common";
export default DefaultArweave;
