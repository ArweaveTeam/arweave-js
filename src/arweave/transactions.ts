import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
import { ArweaveError, ArweaveErrorType } from './lib/error';
import { Transaction, Tag, TransactionInterface } from "./lib/transaction";
import { ArweaveUtils } from './lib/utils';
import { JWKInterface } from './lib/wallet';
import { Wallets } from "./wallets";
import { AxiosResponse } from "axios";

export class Transactions {

    private api: Api;

    private crypto: CryptoInterface;

    constructor(api: Api, crypto: CryptoInterface) {
        this.api = api;
        this.crypto = crypto;
    }

    public getPrice(byteSize: number, targetAddress?: string): Promise<string> {

        let endpoint = targetAddress ? `price/${byteSize}/${targetAddress}` : `price/${byteSize}`;

        return this.api.get(endpoint, {
            transformResponse: [
                /**
                 * We need to specify a response transformer to override
                 * the default JSON.parse behaviour, as this causes
                 * winston to be converted to a number and we want to
                 * return it as a winston string.
                 * @param data 
                 */
                function (data): string {
                    return data;
                }
            ]
        }).then(response => {
            return response.data;
        });
    }

    public get(id: string): Promise<Transaction> {
        return this.api.get(`tx/${id}`).then(response => {

            if (response.status == 200 && response.data && response.data.id == id) {
                return new Transaction(response.data);
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

    public async search(tagName: string, tagValue: string): Promise<string[]> {
        return this.api.post(`arql`, {
            op: 'equals',
            expr1: tagName,
            expr2: tagValue,
        }).then(response => {
            if (!response.data) {
                return [];
            }
            return response.data;
        });
    }

    public getStatus(id: string): Promise<number> {
        return this.api.get(`tx/${id}/id`).then(response => {
            return response.status;
        });
    }

    public async sign(transaction: Transaction, jwk: JWKInterface): Promise<Transaction> {

        let dataToSign = transaction.getSignatureData();

        let rawSignature = await this.crypto.sign(jwk, dataToSign);

        let id = await this.crypto.hash(rawSignature);

        transaction.setSignature({
            signature: ArweaveUtils.bufferTob64Url(rawSignature),
            id: ArweaveUtils.bufferTob64Url(id)
        });

        return transaction;
    }

    public async verify(transaction: Transaction): Promise<boolean> {

        const signaturePayload = transaction.getSignatureData();

        /**
         * The transaction ID should be a SHA-256 hash of the raw signature bytes, so this needs
         * to be recalculated from the signature and checked against the transaction ID.
         */
        const rawSignature = transaction.get('signature', { decode: true, string: false });

        const expectedId = ArweaveUtils.bufferTob64Url(await this.crypto.hash(rawSignature));

        if (transaction.id !== expectedId) {
            throw new Error(`Invalid transaction signature or ID! The transaction ID doesn't match the expected SHA-256 hash of the signature.`);
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

    public post(transaction: Transaction | Buffer | string | object): Promise<AxiosResponse> {
        return this.api.post(`tx`, transaction).then(response => {
            return response;
        });
    }

}
