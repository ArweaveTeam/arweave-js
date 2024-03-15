import Ar from "./ar";
import Api, { ApiConfig } from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import CryptoDriver from "@crypto/node-driver";
import Network from "./network";
import Transactions from "./transactions";
import Wallets from "./wallets";
import Transaction, { TransactionInterface, Tag } from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import * as ArweaveUtils from "./lib/utils";
import Silo from "./silo";
import Chunks from "./chunks";
import Blocks from "./blocks";

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
  data: string | Uint8Array | ArrayBuffer;
  data_size: string;
  data_root: string;
  reward: string;
}

export default class Arweave {
  public api: Api;

  public wallets: Wallets;

  public transactions: Transactions;

  public network: Network;

  public blocks: Blocks;

  public ar: Ar;

  public silo: Silo;

  public chunks: Chunks;

  public static init: (apiConfig: ApiConfig) => Arweave;

  public static crypto: CryptoInterface = new CryptoDriver();

  public static utils = ArweaveUtils;

  constructor(apiConfig: ApiConfig) {
    this.api = new Api(apiConfig);
    this.wallets = new Wallets(this.api, Arweave.crypto);
    this.chunks = new Chunks(this.api);
    this.transactions = new Transactions(this.api, Arweave.crypto, this.chunks);
    this.silo = new Silo(this.api, this.crypto, this.transactions);
    this.network = new Network(this.api);
    this.blocks = new Blocks(this.api, this.network);
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
      crypto: null!,
    };
  }

  public async createTransaction(
    attributes: Partial<CreateTransactionInterface>,
    jwk?: JWKInterface | "use_wallet"
  ): Promise<Transaction> {

    const isValidJWK = jwk && jwk !== "use_wallet" ? await this.validateJWK(jwk) : true;

    if (!isValidJWK) {
      throw new Error(`The JWK is not valid.`);
    }

    const transaction: Partial<CreateTransactionInterface> = {};

    Object.assign(transaction, attributes);

    if (!attributes.data && !(attributes.target && attributes.quantity)) {
      throw new Error(
        `A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`
      );
    }

    if (attributes.owner == undefined) {
      if (jwk && jwk !== "use_wallet") {
        transaction.owner = jwk.n;
      }
    }

    if (attributes.last_tx == undefined) {
      transaction.last_tx = await this.transactions.getTransactionAnchor();
    }

    if (typeof attributes.data === "string") {
      attributes.data = ArweaveUtils.stringToBuffer(attributes.data);
    }

    if (attributes.data instanceof ArrayBuffer) {
      attributes.data = new Uint8Array(attributes.data);
    }

    if (attributes.data && !(attributes.data instanceof Uint8Array)) {
      throw new Error(
        "Expected data to be a string, Uint8Array or ArrayBuffer"
      );
    }

    if (attributes.reward == undefined) {
      const length = attributes.data ? attributes.data.byteLength : 0;
      transaction.reward = await this.transactions.getPrice(
        length,
        transaction.target
      );
    }

    // here we should call prepare chunk
    transaction.data_root = "";
    transaction.data_size = attributes.data
      ? attributes.data.byteLength.toString()
      : "0";
    transaction.data = attributes.data || new Uint8Array(0);

    const createdTransaction = new Transaction(
      transaction as TransactionInterface
    );
    await createdTransaction.getSignatureData();
    return createdTransaction;
  }

  public async createSiloTransaction(
    attributes: Partial<CreateTransactionInterface>,
    jwk: JWKInterface,
    siloUri: string
  ): Promise<Transaction> {
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
      if (!jwk || !jwk.n) {
        throw new Error(
          `A new Arweave transaction must either have an 'owner' attribute, or you must provide the jwk parameter.`
        );
      }
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
    return this.api
      .post("/arql", query)
      .then((response) => response.data || []);
  }

  public async validateJWK(jwk: JWKInterface): Promise<boolean> {
    const transaction = await this.createTransaction({
      data: "test",
    });
    await this.transactions.sign(transaction, jwk);

    return await this.transactions.verify(transaction);
  }
}
