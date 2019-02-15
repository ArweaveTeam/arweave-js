import { Arweave } from "./common";
import { ApiConfig } from "./lib/api";
import { NodeCryptoDriver } from "./lib/crypto/node-driver";

export * from "./common";

export function init(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new NodeCryptoDriver()
  });
}
