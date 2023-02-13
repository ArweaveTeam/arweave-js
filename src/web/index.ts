import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import { getDefaultConfig } from './net-config'

declare global {
  interface Window {
    Arweave: typeof Arweave;
  }
  module globalThis {
    var Arweave: unknown;
  }
}

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {

  const defaults = {
		host: "arweave.net",
		port: 443,
		protocol: "https",
	};

	if(
		typeof location !== "object" 
    || !location.protocol 
    || !location.hostname
	){
		return new Arweave({
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
  const locationPathname = location.pathname;

  const defaultConfig = getDefaultConfig(locationProtocol, locationHost, locationPathname);

  const protocol = apiConfig.protocol || defaultConfig.protocol;
  const host = apiConfig.host || defaultConfig.host;
  const port = apiConfig.port || defaultConfig.port || locationPort;

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
