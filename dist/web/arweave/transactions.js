import { ArweaveError } from './lib/error';
import { Transaction } from "./lib/transaction";
import { ArweaveUtils } from './lib/utils';
export class Transactions {
    constructor(api, crypto) {
        this.api = api;
        this.crypto = crypto;
    }
    getPrice(byteSize, targetAddress) {
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
                function (data) {
                    return data;
                }
            ]
        }).then(response => {
            return response.data;
        });
    }
    get(id) {
        return this.api.get(`tx/${id}`).then(response => {
            if (response.status == 200 && response.data && response.data.id == id) {
                return new Transaction(response.data);
            }
            if (response.status == 202) {
                new ArweaveError("TX_PENDING" /* TX_PENDING */);
            }
            if (response.status == 404) {
                new ArweaveError("TX_NOT_FOUND" /* TX_NOT_FOUND */);
            }
            if (response.status == 410) {
                new ArweaveError("TX_FAILED" /* TX_FAILED */);
            }
            new ArweaveError("TX_INVALID" /* TX_INVALID */);
        });
    }
    getStatus(id) {
        return this.api.get(`tx/${id}/id`).then(response => {
            return response.status;
        });
    }
    async sign(transaction, jwk) {
        let dataToSign = transaction.getSignatureData();
        let rawSignature = await this.crypto.sign(jwk, dataToSign);
        let id = await this.crypto.hash(rawSignature);
        transaction.setSignature({
            signature: ArweaveUtils.bufferTob64Url(rawSignature),
            id: ArweaveUtils.bufferTob64Url(id)
        });
        return transaction;
    }
    async verify(transaction) {
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
        return this.crypto.verify(transaction.owner, signaturePayload, rawSignature);
    }
    post(transaction) {
        return this.api.post(`tx`, transaction).then(response => {
            return response;
        });
    }
}
//# sourceMappingURL=transactions.js.map