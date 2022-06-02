import Arweave from "../src/common/common";
import NodeCryptoDriver from "../src/common/lib/crypto/node-driver";
import { ApiConfig } from "../src/common/lib/api";

Arweave.crypto = new NodeCryptoDriver();

export function initInstance(config: ApiConfig) {
  return new Arweave(config);
}

const defaultInstance = initInstance({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  logging: false,
  timeout: 15000,
});

export function arweaveInstance() {
  return defaultInstance;
}

export function arweaveInstanceDirectNode() {
  console.log(`in function ${arweaveInstanceDirectNode.name} : 'arweave.net' is not a direct node`)
  return initInstance({
    host: "arweave.net",
    protocol: "https",
    port: 443,
    logging: false,
    timeout: 15000,
  });
}
