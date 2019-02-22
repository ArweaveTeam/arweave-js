import * as ArweaveUtils from "./utils";

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
  id: string;
  last_tx: string;
  owner: string;
  tags: Tag[];
  target: string;
  quantity: string;
  data: string;
  reward: string;
  signature: string;
}

export default class Transaction extends BaseObject
  implements TransactionInterface {
  public id: string = "";
  public readonly last_tx: string = "";
  public readonly owner: string = "";
  public readonly tags: Tag[] = [];
  public readonly target: string = "";
  public readonly quantity: string = "0";
  public readonly data: string = "";
  public readonly reward: string = "0";
  public signature: string = "";

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
      id: this.id,
      last_tx: this.last_tx,
      owner: this.owner,
      tags: this.tags,
      target: this.target,
      quantity: this.quantity,
      data: this.data,
      reward: this.reward,
      signature: this.signature
    };
  }

  public setSignature({ signature, id }: { signature: string; id: string }) {
    this.signature = signature;
    this.id = id;
  }

  public getSignatureData(): Uint8Array {
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
      ArweaveUtils.stringToBuffer(tagString)
    ]);
  }
}
