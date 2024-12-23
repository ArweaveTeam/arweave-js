import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import { KeyType, PrivateKey, RSAPrivateKey, EllipticCurvePrivateKey, SECP256k1PrivateKey } from "./lib/crypto/keys";
import { JWKInterface } from "./lib/wallet";
import * as ArweaveUtils from "./lib/utils";
import "arconnect";


export default class Wallets {
  private api: Api;

  private crypto: CryptoInterface;

  constructor(api: Api, crypto: CryptoInterface) {
    this.api = api;
    this.crypto = crypto;
  }

  /**
   * Get the wallet balance for the given address.
   *
   * @param {string} address - The arweave address to get the balance for.
   *
   * @returns {Promise<string>} - Promise which resolves with a winston string balance.
   */
  public getBalance(address: string): Promise<string> {
    return this.api.get(`wallet/${address}/balance`).then((response) => {
      return response.data;
    });
  }

  /**
   * Get the last transaction ID for the given wallet address.
   *
   * @param {string} address - The arweave address to get the transaction for.
   *
   * @returns {Promise<string>} - Promise which resolves with a transaction ID.
   */
  public getLastTransactionID(address: string): Promise<string> {
    return this.api.get(`wallet/${address}/last_tx`).then((response) => {
      return response.data;
    });
  }

  public async generateWallet({type = KeyType.RSA_65537}: {type: KeyType} = {type: KeyType.RSA_65537}): Promise<PrivateKey> {
    switch(type) {
      case KeyType.RSA_65537:
        return RSAPrivateKey.new();
      case KeyType.ED_25519:
        return EllipticCurvePrivateKey.new();
      case KeyType.EC_SECP256K1:
        return SECP256k1PrivateKey.new();
      default:
        throw new Error(`KeyType ${type} is not supported`);
    }
  }

  public generate() {
    return this.crypto.generateJWK();
  }

  public async jwkToAddress(
    jwk?: JWKInterface | "use_wallet"
  ): Promise<string> {
    if (!jwk || jwk === "use_wallet") {
      return this.getAddress();
    } else {
      return this.getAddress(jwk);
    }
  }

  public async getAddress(jwk?: JWKInterface | "use_wallet"): Promise<string> {
    if (!jwk || jwk === "use_wallet") {
      try {
        // @ts-ignore
        await arweaveWallet.connect(["ACCESS_ADDRESS"]);
      } catch {
        // Permission is already granted
      }

      // @ts-ignore
      return arweaveWallet.getActiveAddress();
    } else {
      return this.ownerToAddress(jwk.n);
    }
  }

  public async ownerToAddress(owner: string): Promise<string> {
    return ArweaveUtils.bufferTob64Url(
      await this.crypto.hash(ArweaveUtils.b64UrlToBuffer(owner))
    );
  }
}
