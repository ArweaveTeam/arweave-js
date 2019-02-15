import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import { NodeCryptoDriver } from "./lib/crypto/node-driver";

Arweave.init = function(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new NodeCryptoDriver()
  });
};

export * from "./common";
export default Arweave;
