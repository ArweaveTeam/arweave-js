import { Wallet} from './Wallet';
import { Utils } from './utils';

export class Tag {

    readonly key: string;
    readonly value: string;

    public constructor(key: string, value: string, decode = false){
        this.key = key;
        this.value = value;
    }

    public static decode(t: Tag){

    }
}

export interface TransactionInterface {

    [key:string]: any

    id: string,
    last_tx: string,
    owner: string,
    tags:  Tag[],
    target: string,
    quantity: string,
    data: string,
    reward: string,
    signature: string,
}


export class Transaction implements TransactionInterface{

    [key:string]: any

    public id: string;
    public readonly last_tx: string;
    public readonly owner: string;
    public readonly tags: Tag[];
    public readonly target: string;
    public readonly quantity: string;
    public readonly data: string;
    public readonly reward: string;
    public signature: string;

    public constructor(args?: Partial<TransactionInterface>){
        Object.assign(this, args);
    }

    public getMessageString(): string {
        return this.data;
    }

    public sign(wallet: Wallet) {
        wallet.sign(this.getMessageString());
    }

    public getTags() : Tag[]{
        return this.tags
    }

    public getDecoded(field: string, options = {toString: false}): string|Tag[]{

        if (options.toString) {
            return Utils.b64UrlToString(this[field]);
        }

        return Utils.b64UrlToBuffer(this[field]);

    }

}