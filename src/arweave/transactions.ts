import { AxiosResponse } from 'axios';
import { Api, ApiConfig } from "./lib/api";
import { Transaction } from "./lib/transaction";
import { ArweaveError, ArweaveErrorType } from './lib/error';

export class Transactions {
    
    private api: Api;

    constructor(api: Api){
        this.api = api;
    }

    public get(id: string): Promise<Transaction>{
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

    public getStatus(id: string): Promise<number>{
        return this.api.get(`tx/${id}/id`).then( response => {
            return response.status;
        });
    }

}

