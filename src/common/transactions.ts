import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import ArweaveError, { ArweaveErrorType } from "./lib/error";
import Transaction from "./lib/transaction";
import * as ArweaveUtils from "./lib/utils";
import { JWKInterface } from "./lib/wallet";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import {
  TransactionUploader,
  SerializedUploader
} from "./lib/transaction-uploader";
import { MAX_CHUNK_SIZE } from "./lib/merkle";

export interface TransactionConfirmedData {
  block_indep_hash: string;
  block_height: number;
  number_of_confirmations: number;
}

export interface TransactionStatusResponse {
  status: number;
  confirmed: TransactionConfirmedData | null;
}

export type UploadProgressFn = (loaded: number, total: number) => Promise<void> | void

export default class Transactions {
  private api: Api;

  private crypto: CryptoInterface;

  constructor(api: Api, crypto: CryptoInterface) {
    this.api = api;
    this.crypto = crypto;
  }

  public getTransactionAnchor(): Promise<string> {
    return this.api.get(`tx_anchor`).then(response => {
      return response.data;
    });
  }

  public getPrice(byteSize: number, targetAddress?: string): Promise<string> {
    let endpoint = targetAddress
      ? `price/${byteSize}/${targetAddress}`
      : `price/${byteSize}`;

    return this.api
      .get(endpoint, {
        transformResponse: [
          /**
           * We need to specify a response transformer to override
           * the default JSON.parse behaviour, as this causes
           * winston to be converted to a number and we want to
           * return it as a winston string.
           * @param data
           */
          function(data): string {
            return data;
          }
        ]
      })
      .then(response => {
        return response.data;
      });
  }

  public async get(id: string): Promise<Transaction> {
    const response = await this.api.get(`tx/${id}`);

    if (response.status == 200) {
      if (response.data.format >= 2 && response.data.data_size > 0) {
        const data = await this.getData(id);
        return new Transaction({
          ...response.data,
          data
        });
      }
      return new Transaction({
        ...response.data,
        format: response.data.format || 1
      });
    }

    if (response.status == 202) {
      throw new ArweaveError(ArweaveErrorType.TX_PENDING);
    }

    if (response.status == 404) {
      throw new ArweaveError(ArweaveErrorType.TX_NOT_FOUND);
    }

    if (response.status == 410) {
      throw new ArweaveError(ArweaveErrorType.TX_FAILED);
    }

    throw new ArweaveError(ArweaveErrorType.TX_INVALID);
  }

  public fromRaw(attributes: object): Transaction {
    return new Transaction(attributes);
  }

  public async search(tagName: string, tagValue: string): Promise<string[]> {
    return this.api
      .post(`arql`, {
        op: "equals",
        expr1: tagName,
        expr2: tagValue
      })
      .then(response => {
        if (!response.data) {
          return [];
        }
        return response.data;
      });
  }

  public getStatus(id: string): Promise<TransactionStatusResponse> {
    return this.api.get(`tx/${id}/status`).then(response => {
      if (response.status == 200) {
        return {
          status: 200,
          confirmed: response.data
        };
      }
      return {
        status: response.status,
        confirmed: null
      };
    });
  }

  public getData(
    id: string,
    options?: { decode?: boolean; string?: boolean }
  ): Promise<string | Uint8Array> {
    return this.api.get(`tx/${id}/data`).then(response => {
      if (response.status === 200) {
        const data = response.data;

        if (options && options.decode == true) {
          if (options && options.string) {
            return ArweaveUtils.b64UrlToString(data);
          }

          return ArweaveUtils.b64UrlToBuffer(data);
        }

        return data;
      }

      return options && options.decode ? new Uint8Array(0) : "";
    });
  }

  public async sign(
    transaction: Transaction,
    jwk: JWKInterface
  ): Promise<void> {
    let dataToSign = await transaction.getSignatureData();

    let rawSignature = await this.crypto.sign(jwk, dataToSign);

    let id = await this.crypto.hash(rawSignature);

    transaction.setSignature({
      signature: ArweaveUtils.bufferTob64Url(rawSignature),
      id: ArweaveUtils.bufferTob64Url(id)
    });
  }

  public async verify(transaction: Transaction): Promise<boolean> {
    const signaturePayload = await transaction.getSignatureData();

    /**
     * The transaction ID should be a SHA-256 hash of the raw signature bytes, so this needs
     * to be recalculated from the signature and checked against the transaction ID.
     */
    const rawSignature = transaction.get("signature", {
      decode: true,
      string: false
    });

    const expectedId = ArweaveUtils.bufferTob64Url(
      await this.crypto.hash(rawSignature)
    );

    if (transaction.id !== expectedId) {
      throw new Error(
        `Invalid transaction signature or ID! The transaction ID doesn't match the expected SHA-256 hash of the signature.`
      );
    }

    /**
     * Now verify the signature is valid and signed by the owner wallet (owner field = originating wallet public key).
     */
    return this.crypto.verify(
      transaction.owner,
      signaturePayload,
      rawSignature
    );
  }

  public fromTransaction(transaction: Transaction | Buffer | string | object) {
    if (typeof transaction === "string") {
      return new Transaction(JSON.parse(transaction));
    } else if (transaction instanceof Buffer) {
      return new Transaction(JSON.parse(transaction.toString()));
    } else if (transaction instanceof Transaction) {
      return transaction;
    } else if (typeof transaction === "object") {
      return new Transaction(transaction);
    }
  }

  public async post(
    tx: Transaction | Buffer | string | object,
    onUploadProgress?: UploadProgressFn,
  ): Promise<{ status: number; statusText: string; data: any }> {
    const transaction = this.fromTransaction(tx)

    if (!(transaction instanceof Transaction)) {
      throw new Error(`Must be Transaction object`);
    } else if (transaction.data.byteLength > 1024 * 1024 * 10) {
      console.warn(
        `transactions.getUploader() or transactions.upload() is recommended for large data transactions`
      );
    }

    const uploader = await this.getUploader(transaction);

    let loaded: number = 0
    const onChunkUploadProgress = (event: any) => {
      loaded += event.loaded
      onUploadProgress?.(loaded, uploader.size)
    }

    // Emulate existing error & return value behaviour.
    try {
      while (!uploader.isComplete) {
        await uploader.uploadChunk(onChunkUploadProgress);
      }
    } catch (e) {
      if (uploader.lastResponseStatus > 0) {
        return {
          status: uploader.lastResponseStatus,
          statusText: uploader.lastResponseError,
          data: {
            error: uploader.lastResponseError
          }
        };
      }
      throw e;
    }

    return {
      status: 200,
      statusText: "OK",
      data: {}
    };
  }

  /**
   * Gets an uploader than can be used to upload a transaction chunk by chunk, giving progress
   * and the ability to resume.
   *
   * Usage example:
   *
   * ```
   * const uploader = arweave.transactions.getUploader(transaction);
   * while (!uploader.isComplete) {
   *   await uploader.uploadChunk();
   *   console.log(`${uploader.pctComplete}%`);
   * }
   * ```
   *
   * @param upload a Transaction object, a previously save progress object, or a transaction id.
   * @param data the data of the transaction. Required when resuming an upload.
   */
  public async getUploader(
    upload: Transaction | SerializedUploader | string,
    data?: Uint8Array | ArrayBuffer
  ) {
    let uploader!: TransactionUploader;

    if (upload instanceof Transaction) {
      uploader = new TransactionUploader(this.api, upload);
    } else {
      if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
      }

      if (!data || !(data instanceof Uint8Array)) {
        throw new Error(`Must provide data when resuming upload`);
      }

      if (typeof upload === "string") {
        upload = await TransactionUploader.fromTransactionId(this.api, upload);
      }

      // upload should be a serialized upload.
      uploader = await TransactionUploader.fromSerialized(
        this.api,
        upload,
        data
      );
    }

    return uploader;
  }

  /**
   * Async generator version of uploader
   *
   * Usage example:
   *
   * ```
   * for await (const uploader of arweave.transactions.upload(tx)) {
   *  console.log(`${uploader.pctComplete}%`);
   * }
   * ```
   *
   * @param upload a Transaction object, a previously save uploader, or a transaction id.
   * @param data the data of the transaction. Required when resuming an upload.
   */
  public async *upload(
    upload: Transaction | SerializedUploader | string,
    data?: Uint8Array,
    onUploadProgress?: UploadProgressFn
  ) {
    const uploader = await this.getUploader(upload, data);

    const total = uploader.size;
    let loaded: number = 0
    const onChunkUploadProgress = (event: any) => {
      loaded += event.loaded
      onUploadProgress?.(loaded, total)
    }

    while (!uploader.isComplete) {
      await uploader.uploadChunk(onChunkUploadProgress);
      yield uploader;
    }

    return uploader;
  }
}
