import WebCryptoDriver from "./webcrypto-driver";

/**
 * WebCrypto driver for Node, kept for its import path and class name.
 */
export default class NodeCryptoDriver extends WebCryptoDriver {
  public readonly encryptionAlgorithm = "aes-256-cbc";
}
