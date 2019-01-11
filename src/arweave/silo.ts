import { Api } from "./lib/api";
import { CryptoInterface } from './lib/crypto/crypto-interface';
import { Transactions } from './transactions';
import { ArweaveUtils } from './lib/utils';
import { Transaction } from './lib/transaction';

export class Silo {

    private api: Api;

    private crypto: CryptoInterface;

    private transactions: Transactions;

    constructor(api: Api, crypto: CryptoInterface, transactions: Transactions) {
        this.api = api;
        this.crypto = crypto;
        this.transactions = transactions;
    }

    public async get(siloURI: string): Promise<Uint8Array> {

        if (!siloURI) {
            throw new Error(`No Silo URI specified`);
        }

        const resource = await this.parseUri(siloURI);

        const ids = await this.transactions.search('Silo-Name', resource.getAccessKey());

        if (ids.length == 0) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`);
        }

        const transaction = await this.transactions.get(ids[0]);

        if (!transaction) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`);
        }

        const encrypted = transaction.get('data', { decode: true, string: false });

        return this.crypto.decrypt(encrypted, resource.getEncryptionKey());
    }

    public async readTransactionData(transaction: Transaction, siloURI: string) {

        if (!siloURI) {
            throw new Error(`No Silo URI specified`);
        }

        const resource = await this.parseUri(siloURI);

        const encrypted = transaction.get('data', { decode: true, string: false });

        return this.crypto.decrypt(encrypted, resource.getEncryptionKey());
    }

    public async parseUri(siloURI: string): Promise<SiloResource> {

        const parsed = siloURI.match(/^([a-z0-9-_]+)\.([0-9]+)/i);

        if (!parsed) {
            throw new Error(`Invalid Silo name, must be a name in the format of [a-z0-9]+.[0-9]+, e.g. 'bubble.7'`);
        }

        const siloName = parsed[1];

        const hashIterations = Math.pow(2, parseInt(parsed[2]));

        const digest = await this.hash(ArweaveUtils.stringToBuffer(siloName), hashIterations);

        const accessKey = ArweaveUtils.bufferTob64(digest.slice(0, 15));

        const encryptionkey = await this.hash(digest.slice(16, 31), 1);

        return new SiloResource(siloURI, accessKey, encryptionkey);

    }

    private async hash(input: Uint8Array, iterations: number): Promise<Uint8Array> {

        let digest = await this.crypto.hash(input);

        for (let count = 0; count < (iterations - 1); count++) {
            digest = await this.crypto.hash(digest)
        }

        return digest;
    }

}

export class SiloResource {

    private uri: string;

    private accessKey: string;

    private encryptionKey: Uint8Array;

    constructor(uri: string, accessKey: string, encryptionKey: Uint8Array) {
        this.uri = uri;
        this.accessKey = accessKey;
        this.encryptionKey = encryptionKey;
    }

    public getUri(): string {
        return this.uri;
    }

    public getAccessKey(): string {
        return this.accessKey;
    }

    public getEncryptionKey(): Uint8Array {
        return this.encryptionKey;
    }

}
