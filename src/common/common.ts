import Ar from "./ar";
import Api, { ApiConfig } from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import Network from "./network";
import Transactions from "./transactions";
import Wallets from "./wallets";
import Transaction, { TransactionInterface, Tag } from "./lib/transaction";
import * as Merkle from "./lib/merkle";
import { JWKInterface } from "./lib/wallet";
import * as ArweaveUtils from "./lib/utils";
import Silo from "./silo";

export interface Config {
  api: ApiConfig;
  crypto: CryptoInterface;
}

export interface CreateTransactionInterface {
  format: number;
  last_tx: string;
  owner: string;
  tags: Tag[];
  target: string;
  quantity: string;
  data: string | Uint8Array;
  data_size: string;
  data_root?: string;
  reward: string;
}

export default class Arweave {
  public api: Api;

  public wallets: Wallets;

  public transactions: Transactions;

  public network: Network;

  public ar: Ar;

  public silo: Silo;

  public static init: (apiConfig: ApiConfig) => Arweave;

  public static crypto: CryptoInterface;

  public static utils = ArweaveUtils;

  constructor(apiConfig: ApiConfig) {
    this.api = new Api(apiConfig);
    this.wallets = new Wallets(this.api, Arweave.crypto);

    this.transactions = new Transactions(this.api, Arweave.crypto);
    this.silo = new Silo(this.api, this.crypto, this.transactions);

    this.network = new Network(this.api);
    this.ar = new Ar();
  }

  /** @deprecated */
  public get crypto(): CryptoInterface {
    return Arweave.crypto;
  }

  /** @deprecated */
  public get utils(): typeof ArweaveUtils {
    return Arweave.utils;
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

    if(!attributes.data || !attributes.data.length) {
      attributes.data = undefined;
    }

    if (attributes.owner == undefined) {
      transaction.owner = jwk.n;
    }

    if (attributes.last_tx == undefined) {
      transaction.last_tx = await this.transactions.getTransactionAnchor();
    }

    if (typeof attributes.data === "string") {
      attributes.data = ArweaveUtils.stringToBuffer(attributes.data);
    }

    if (attributes.data && !(attributes.data instanceof Uint8Array)) {
      throw new Error("Expected data to be a string or Uint8Array");
    }

    if (attributes.reward == undefined) {
      const length = attributes.data ? attributes.data.byteLength : 0;
      transaction.reward = await this.transactions.getPrice(
        length,
        transaction.target
      );
    }

    if (attributes.data) {
      const rootHash = await Merkle.computeRootHash(attributes.data);
      transaction.data_size = attributes.data.byteLength.toString();
      transaction.data_root = ArweaveUtils.bufferTob64Url(rootHash);
      transaction.data = ArweaveUtils.bufferTob64Url(attributes.data);
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
      transaction.last_tx = await this.transactions.getTransactionAnchor();
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

  public arql(query: object): Promise<string[]> {
    return this.api.post("/arql", query).then(response => response.data || []);
  }
}
