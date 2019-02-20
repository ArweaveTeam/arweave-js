import Ar from "./ar";
import Api, { ApiConfig } from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import Network from "./network";
import Transactions from "./transactions";
import Wallets from "./wallets";
import Transaction, { TransactionInterface, Tag } from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import ArweaveUtils from "./lib/utils";
import Silo from "./silo";

export interface Config<T = object> {
  api: ApiConfig;
  crypto: CryptoInterface;
}

export interface CreateTransactionInterface {
  last_tx: string;
  owner: string;
  tags: Tag[];
  target: string;
  quantity: string;
  data: string | Uint8Array;
  reward: string;
}

export default class Arweave {
  public api: Api;

  public wallets: Wallets;

  public transactions: Transactions;

  public network: Network;

  public ar: Ar;

  public silo: Silo;

  public crypto: CryptoInterface;

  public utils: ArweaveUtils;

  public static init: (apiConfig: ApiConfig) => Arweave;

  constructor(config: Config) {
    this.crypto = config.crypto;

    this.api = new Api(config.api);
    this.wallets = new Wallets(this.api, config.crypto);

    this.transactions = new Transactions(this.api, config.crypto);
    this.silo = new Silo(this.api, this.crypto, this.transactions);

    this.network = new Network(this.api);
    this.ar = new Ar();

    this.utils = ArweaveUtils;
  }

  public getConfig(): Config {
    return {
      api: this.api.getConfig(),
      crypto: null!
    };
  }

  public async createTransaction(
    attributes: Partial<CreateTransactionInterface>,
    jwk: JWKInterface
  ): Promise<Transaction> {
    const from = await this.wallets.jwkToAddress(jwk);

    const transaction: Partial<CreateTransactionInterface> = {};

    Object.assign(transaction, attributes);

    if (!attributes.data && !(attributes.target && attributes.quantity)) {
      throw new Error(
        `A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`
      );
    }

    if (attributes.owner == undefined) {
      transaction.owner = jwk.n;
    }

    if (attributes.last_tx == undefined) {
      transaction.last_tx = await this.wallets.getLastTransactionID(from);
    }

    if (attributes.reward == undefined) {
      const length = ((data?: string | Uint8Array): number => {
        if (data == undefined) {
          return 0;
        }
        if (typeof data == "string") {
          return data.length;
        }
        if (data instanceof Uint8Array) {
          return data.byteLength;
        }
        throw new Error("Expected data to be a string or Uint8Array");
      })(attributes.data);

      transaction.reward = await this.transactions.getPrice(
        length,
        transaction.target
      );
    }

    if (attributes.data) {
      if (typeof attributes.data == "string") {
        transaction.data = ArweaveUtils.stringToB64Url(attributes.data);
      }
      if (attributes.data instanceof Uint8Array) {
        transaction.data = ArweaveUtils.bufferTob64Url(attributes.data);
      }
    }

    return new Transaction(transaction as TransactionInterface);
  }

  public async createSiloTransaction(
    attributes: Partial<CreateTransactionInterface>,
    jwk: JWKInterface,
    siloUri: string
  ): Promise<Transaction> {
    const from = await this.wallets.jwkToAddress(jwk);

    const transaction: Partial<CreateTransactionInterface> = {};

    Object.assign(transaction, attributes);

    if (!attributes.data) {
      throw new Error(`Silo transactions must have a 'data' value`);
    }

    if (!siloUri) {
      throw new Error(`No Silo URI specified.`);
    }

    if (attributes.target || attributes.quantity) {
      throw new Error(
        `Silo transactions can only be used for storing data, sending AR to other wallets isn't supported.`
      );
    }

    if (attributes.owner == undefined) {
      transaction.owner = jwk.n;
    }

    if (attributes.last_tx == undefined) {
      transaction.last_tx = await this.wallets.getLastTransactionID(from);
    }

    const siloResource = await this.silo.parseUri(siloUri);

    if (typeof attributes.data == "string") {
      const encrypted = await this.crypto.encrypt(
        ArweaveUtils.stringToBuffer(attributes.data),
        siloResource.getEncryptionKey()
      );
      transaction.reward = await this.transactions.getPrice(
        encrypted.byteLength
      );
      transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
    }

    if (attributes.data instanceof Uint8Array) {
      const encrypted = await this.crypto.encrypt(
        attributes.data,
        siloResource.getEncryptionKey()
      );
      transaction.reward = await this.transactions.getPrice(
        encrypted.byteLength
      );
      transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
    }

    const siloTransaction = new Transaction(
      transaction as TransactionInterface
    );

    siloTransaction.addTag("Silo-Name", siloResource.getAccessKey());
    siloTransaction.addTag("Silo-Version", `0.1.0`);

    return siloTransaction;
  }
}
