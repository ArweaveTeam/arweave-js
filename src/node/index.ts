import { Arweave } from "./arweave/arweave";
import { ApiConfig } from "./arweave/lib/api";
import { NodeCryptoDriver } from "./arweave/lib/crypto/node-driver";

export function init(apiConfig: ApiConfig = {}): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new NodeCryptoDriver()
  });
}
