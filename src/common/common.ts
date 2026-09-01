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

export type {
  ExternalWallet,
  ExternalWalletSignedTransaction,
  WalletPermission,
} from "./lib/external-wallet";

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

  /** @deprecated use GQL https://gql-guide.arweave.net */
  public async arql(query: object): Promise<string[]> {
    const ids = new Set<string>();

    for (const clause of arqlToClauses(query)) {
      let after: string | undefined;

      for (;;) {
        const res = await this.api.post("graphql", {
          query: `query($owners: [String!], $recipients: [String!], $tags: [TagFilter!], $after: String) {
            transactions(
              owners: $owners
              recipients: $recipients
              tags: $tags
              first: 100
              after: $after
              sort: HEIGHT_DESC
            ) {
              pageInfo { hasNextPage }
              edges { cursor node { id } }
            }
          }`,
          variables: {
            owners: clause.owners.length ? clause.owners : undefined,
            recipients: clause.recipients.length ? clause.recipients : undefined,
            tags: clause.tags.length ? clause.tags : undefined,
            after,
          },
        });

        if (!res.ok || res.data?.errors) {
          throw new Error(
            `Could not run arql query. Received: ${res.data}. Status: ${res.status}, ${res.statusText}`
          );
        }

        const { pageInfo, edges } = res.data.data.transactions;

        for (const edge of edges) {
          ids.add(edge.node.id);
        }

        if (!pageInfo.hasNextPage || !edges.length) break;

        after = edges[edges.length - 1].cursor;
      }
    }

    return [...ids];
  }
}

interface ArqlClause {
  owners: string[];
  recipients: string[];
  tags: { name: string; values: string[] }[];
}

function mergeOne(a: string[], b: string[]): string[] {
  if (a.length && b.length) {
    throw new Error(
      `Invalid ARQL query: cannot combine two 'from' or 'to' constraints`
    );
  }

  return a.length ? a : b;
}

/** Expands an ARQL expression tree into a list of clauses to be OR'd together. */
function arqlToClauses(query: any): ArqlClause[] {
  if (!query || typeof query !== "object") {
    throw new Error(`Invalid ARQL query: expected an expression object`);
  }

  const { op, expr1, expr2 } = query;

  if (op === "equals") {
    if (typeof expr1 !== "string" || typeof expr2 !== "string") {
      throw new Error(`Invalid ARQL query: 'equals' expects two strings`);
    }

    if (expr1 === "from") {
      return [{ owners: [expr2], recipients: [], tags: [] }];
    }

    if (expr1 === "to") {
      return [{ owners: [], recipients: [expr2], tags: [] }];
    }

    return [
      { owners: [], recipients: [], tags: [{ name: expr1, values: [expr2] }] },
    ];
  }

  if (op === "or") {
    return [...arqlToClauses(expr1), ...arqlToClauses(expr2)];
  }

  if (op === "and") {
    const clauses: ArqlClause[] = [];

    for (const a of arqlToClauses(expr1)) {
      for (const b of arqlToClauses(expr2)) {
        clauses.push({
          owners: mergeOne(a.owners, b.owners),
          recipients: mergeOne(a.recipients, b.recipients),
          tags: [...a.tags, ...b.tags],
        });
      }
    }

    return clauses;
  }

  throw new Error(`Invalid ARQL query: unsupported op '${op}'`);
}
