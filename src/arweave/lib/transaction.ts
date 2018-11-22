import { Wallet} from './Wallet';

export interface Tag {
    key: string,
    value: string,
}

export class Transaction {

    protected id : string;
    protected last_tx: string;
    protected owner: string;
    protected tags: Tag[];
    protected target: string;
    protected quantity: string;
    protected data: string;
    protected reward: string;
    protected signature: string;

    public constructor(args: {
        id? :string,
        last_tx? :string,
        owner? :string,
        tags? : Tag[],
        target? :string,
        quantity? :string,
        data? :string,
        reward? :string,
        signature? :string,
    }){
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

}