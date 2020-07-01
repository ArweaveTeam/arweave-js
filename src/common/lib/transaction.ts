import * as ArweaveUtils from "./utils";
import deepHash from "./deepHash";
import { Chunk, Proof, generateTransactionChunks } from './merkle';

class BaseObject {
  [key: string]: any;

  public get(field: string): string;
  public get(
    field: string,
    options: { decode: true; string: false }
  ): Uint8Array;
  public get(field: string, options: { decode: true; string: true }): string;

  public get(
    field: string,
    options?: {
      string?: boolean;
      decode?: boolean;
    }
  ): string | Uint8Array | Tag[] {
    if (!Object.getOwnPropertyNames(this).includes(field)) {
      throw new Error(
        `Field "${field}" is not a property of the Arweave Transaction class.`
      );
    }

    // Handle fields that are Uint8Arrays.
    // To maintain compat we encode them to b64url 
    // if decode option is not specificed.
    if (this[field] instanceof Uint8Array) {
      if (options && options.decode && options.string) {
        return ArweaveUtils.bufferToString(this[field]);
      }
      if (options && options.decode && !options.string) {
        return this[field]
      }
      return ArweaveUtils.bufferTob64Url(this[field])
    }

    if (options && options.decode == true) {
      if (options && options.string) {
        return ArweaveUtils.b64UrlToString(this[field]);
      }

      return ArweaveUtils.b64UrlToBuffer(this[field]);
    }

    return this[field];
  }
}

export class Tag extends BaseObject {
  readonly name: string;
  readonly value: string;

  public constructor(name: string, value: string, decode = false) {
    super();
    this.name = name;
    this.value = value;
  }
}

export interface TransactionInterface {
  format: number;
  id: string;
  last_tx: string;
  owner: string;
  tags: Tag[];
  target: string;
  quantity: string;
  data: Uint8Array;
  reward: string;
  signature: string;
  data_size: string;
  data_root: string;
}

export default class Transaction extends BaseObject
  implements TransactionInterface {
  public readonly format: number = 2;
  public id: string = "";
  public readonly last_tx: string = "";
  public readonly owner: string = "";
  public readonly tags: Tag[] = [];
  public readonly target: string = "";
  public readonly quantity: string = "0";
  public readonly data_size: string = "0";
  public data: Uint8Array = new Uint8Array();
  public data_root: string = "";
  public reward: string = "0";
  public signature: string = "";

  // Computed when needed.
  public chunks?: {
    data_root: Uint8Array
    chunks: Chunk[]
    proofs: Proof[]
  }
  
  public constructor(attributes: Partial<TransactionInterface> = {}) {
    super();
    Object.assign(this, attributes);

    if (attributes.tags) {
      this.tags = attributes.tags.map(
        (tag: { name: string; value: string }) => {
          return new Tag(tag.name, tag.value);
        }
      );
    }
  }

  public addTag(name: string, value: string) {
    this.tags.push(
      new Tag(
        ArweaveUtils.stringToB64Url(name),
        ArweaveUtils.stringToB64Url(value)
      )
    );
  }

  public toJSON() {
    return {
      format: this.format,
      id: this.id,
      last_tx: this.last_tx,
      owner: this.owner,
      tags: this.tags,
      target: this.target,
      quantity: this.quantity,
      data: ArweaveUtils.bufferTob64Url(this.data),
      data_size: this.data_size,
      data_root: this.data_root,
      data_tree: this.data_tree,
      reward: this.reward,
      signature: this.signature,
    };
  }

  public setSignature({ signature, id }: { signature: string; id: string }) {
    this.signature = signature;
    this.id = id;
  }

  public async getSignatureData(): Promise<Uint8Array> {
    switch (this.format) {
      case 1:
        let tagString = this.tags.reduce((accumulator: string, tag: Tag) => {
          return (
            accumulator +
            tag.get("name", { decode: true, string: true }) +
            tag.get("value", { decode: true, string: true })
          );
        }, "");

        return ArweaveUtils.concatBuffers([
          this.get("owner", { decode: true, string: false }),
          this.get("target", { decode: true, string: false }),
          this.get("data", { decode: true, string: false }),
          ArweaveUtils.stringToBuffer(this.quantity),
          ArweaveUtils.stringToBuffer(this.reward),
          this.get("last_tx", { decode: true, string: false }),
          ArweaveUtils.stringToBuffer(tagString),
        ]);
      case 2:

        if (!this.chunks && this.data.byteLength > 0) {
          this.chunks = await generateTransactionChunks(this.data);
          this.data_root = ArweaveUtils.bufferTob64Url(this.chunks.data_root);         
        }
        
        const tagList: [Uint8Array, Uint8Array][] = this.tags.map((tag) => [
          tag.get("name", { decode: true, string: false }),
          tag.get("value", { decode: true, string: false }),
        ]);

        return await deepHash([
          ArweaveUtils.stringToBuffer(this.format.toString()),
          this.get("owner", { decode: true, string: false }),
          this.get("target", { decode: true, string: false }),
          ArweaveUtils.stringToBuffer(this.quantity),
          ArweaveUtils.stringToBuffer(this.reward),
          this.get("last_tx", { decode: true, string: false }),
          tagList,
          ArweaveUtils.stringToBuffer(this.data_size),
          this.get("data_root", { decode: true, string: false }),
        ]);
      default:
        throw new Error(`Unexpected transaction format: ${this.format}`);
    }
  }
}
