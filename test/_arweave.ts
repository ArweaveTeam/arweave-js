import Arweave from "../src/common/common";
import NodeCryptoDriver from "../src/common/lib/crypto/node-driver";

export function arweaveInstance() {
  return new Arweave({
    api: { host: "arweave.net", logging: false },
    crypto: new NodeCryptoDriver()
  });
}
