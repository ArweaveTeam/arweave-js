import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import { JWKInterface } from "./lib/wallet";
import * as ArweaveUtils from "./lib/utils";
import "arconnect";
import Transaction from "lib/transaction";
import Transactions from "transactions";
import Chunks from "chunks";
import Arweave from "./common";

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
      // verify the JWK produces valid transactions
      const isValid = await new Arweave(this.api.getConfig()).validateJWK(jwk);
      if (!isValid) {
        throw new Error("The JWK is not valid.");
      }
      return this.ownerToAddress(jwk.n);
    }
  }

  public async ownerToAddress(owner: string): Promise<string> {
    const buffer = await ArweaveUtils.b64UrlToBuffer(owner);
    // RSA 4096 keys have an n length of 512 bytes. Validate JWK should handle this, so this is just a sanity check.
    if (buffer.byteLength !== 512) {
      throw new Error("Invalid JWK");
    }
    return ArweaveUtils.bufferTob64Url(
      await this.crypto.hash(buffer)
    );
  }
}
