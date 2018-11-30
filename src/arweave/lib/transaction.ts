import { ArweaveUtils } from './utils';

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


export class Transaction implements TransactionInterface {

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

    public constructor(args?: Partial<TransactionInterface>) {
        Object.assign(this, args);
    }

    public clearSignature(){
        this.signature = null;
        this.id = null;
    }

    public setSignature({signature, id}: {
        signature: string,
        id: string,
    }) {
        this.signature = signature;
        this.id = id;
    }

    public getSignatureData(): ArrayBuffer | SharedArrayBuffer {
        return ArweaveUtils.concatBuffers([
            this.get('owner', {decode: true, toString: false}),
            this.get('target', {decode: true, toString: false}),
            this.get('data', {decode: true, toString: false}),
            ArweaveUtils.stringToBuffer(this.quantity),
            ArweaveUtils.stringToBuffer(this.reward),
            this.get('last_tx', {decode: true, toString: false}),
        ]);
    }

    public getTags() : Tag[]{
        return this.tags
    }

    public get(field: string, options?: {
        toString?: boolean,
        decode?: boolean
    }): string | ArrayBuffer | Uint8Array | SharedArrayBuffer | Tag[] {

        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }

        if (options && options.decode) {

            if (options && options.toString) {
                return ArweaveUtils.b64UrlToString(this[field]);
            }

            return ArweaveUtils.b64UrlToBuffer(this[field]);
        }

        return this[field];

    }
}