import { Arweave } from "./arweave/arweave";
import { NodeCryptoDriver } from "./arweave/lib/crypto/node-driver";

export function init(apiConfig: object): Arweave {
  return new Arweave({
    api: apiConfig,
    crypto: new NodeCryptoDriver()
  });
}
