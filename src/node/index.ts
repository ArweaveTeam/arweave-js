import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import NodeCryptoDriver from "./lib/crypto/node-driver";
import Fetch from "./lib/api/browser-fetch";

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new NodeCryptoDriver(),
    fetch: Fetch
  });
};

export = Arweave;
