import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import NodeCryptoDriver from "./lib/crypto/node-driver";

Arweave.crypto = new NodeCryptoDriver();

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  return new Arweave(apiConfig);
};

export = Arweave;
