import Arweave from "../src/common/common";
import NodeCryptoDriver from "../src/common/lib/crypto/node-driver";
import { ApiConfig } from "../src/common/lib/api";

export function initInstance(config: ApiConfig) {
  return new Arweave({
    api: config,
    crypto: new NodeCryptoDriver()
  });
}

const defaultInstance = initInstance({ host: "arweave.net", logging: false });

export function arweaveInstance() {
  return defaultInstance;
}
