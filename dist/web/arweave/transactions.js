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
            if (response.status == 200) {
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
}
//# sourceMappingURL=transactions.js.map