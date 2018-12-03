import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
import { ArweaveError, ArweaveErrorType } from './lib/error';
import { Transaction, Tag, TransactionInterface } from "./lib/transaction";
import { ArweaveUtils } from './lib/utils';
import { JWKInterface } from './lib/Wallet';
import { Wallets } from "./wallets";

export class Transactions {
    
    private api: Api;
    private crypto: CryptoInterface;

    constructor(api: Api, crypto: CryptoInterface){
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
                function(data): string {
                return data;
              }
            ]
        }).then( response => {
            return response.data;
        });
    }

    public get(id: string): Promise<Transaction> {
        return this.api.get(`tx/${id}`).then( response => {

            if (response.status == 200) {
                return new Transaction(response.data);
            }

            if (response.status == 202) {
                new ArweaveError(ArweaveErrorType.TX_PENDING);
            }

            if (response.status == 404) {
                new ArweaveError(ArweaveErrorType.TX_NOT_FOUND);
            }

            if (response.status == 410) {
                new ArweaveError(ArweaveErrorType.TX_FAILED);
            }

        });
    }

    public getStatus(id: string): Promise<number> {
        return this.api.get(`tx/${id}/id`).then( response => {
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


}
