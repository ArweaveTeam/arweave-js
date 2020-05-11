import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import ArweaveError, { ArweaveErrorType } from "./lib/error";
import Transaction from "./lib/transaction";
import * as ArweaveUtils from "./lib/utils";
import { JWKInterface } from "./lib/wallet";
import { AxiosResponse } from "axios";

export interface TransactionConfirmedData {
  block_indep_hash: string;
  block_height: number;
  number_of_confirmations: number;
}
export interface TransactionStatusResponse {
  status: number;
  confirmed: TransactionConfirmedData | null;
}

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
      if (response.data.format >= 2 && response.data.data_size) {
        const data = await this.getData(id);
        return new Transaction({
          ...response.data,
          data,
        });
      }
      return new Transaction({
        ...response.data,
        format: response.data.format || 1,
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
    });
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

      return null;
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

  public post(
    transaction: Transaction | Buffer | string | object
  ): Promise<AxiosResponse> {
    return this.api.post(`tx`, transaction).then(response => {
      return response;
    });
  }
}
