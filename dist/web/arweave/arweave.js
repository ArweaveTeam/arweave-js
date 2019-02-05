import { Ar } from "./ar";
import { Api } from "./lib/api";
import { Network } from "./network";
import { Transactions } from "./transactions";
import { Wallets } from "./wallets";
import { Transaction } from "./lib/transaction";
import { ArweaveUtils } from "./lib/utils";
import { Silo } from "./silo";
export class Arweave {
    constructor(config) {
        this.crypto = config.crypto;
        this.api = new Api(config.api);
        this.wallets = new Wallets(this.api, config.crypto);
        this.transactions = new Transactions(this.api, config.crypto);
        this.silo = new Silo(this.api, this.crypto, this.transactions);
        this.network = new Network(this.api);
        this.ar = new Ar();
        this.utils = ArweaveUtils;
    }
    getConfig() {
        return {
            api: this.api.getConfig(),
            crypto: null
        };
    }
    async createTransaction(attributes, jwk) {
        const from = await this.wallets.jwkToAddress(jwk);
        const transaction = {};
        Object.assign(transaction, attributes);
        if (!attributes.data && !(attributes.target && attributes.quantity)) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`);
        }
        if (attributes.owner == undefined) {
            transaction.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.wallets.getLastTransactionID(from);
        }
        if (attributes.reward == undefined) {
            const length = ((data) => {
                if (typeof data == "string") {
                    return data.length;
                }
                if (data instanceof Uint8Array) {
                    return data.byteLength;
                }
                throw new Error("Expected data to be a string or Uint8Array");
            })(attributes.data);
            transaction.reward = await this.transactions.getPrice(length, transaction.target ? transaction.target : null);
        }
        if (attributes.data) {
            if (typeof attributes.data == "string") {
                transaction.data = ArweaveUtils.stringToB64Url(attributes.data);
            }
            if (attributes.data instanceof Uint8Array) {
                transaction.data = ArweaveUtils.bufferTob64Url(attributes.data);
            }
        }
        return new Transaction(transaction);
    }
    async createSiloTransaction(attributes, jwk, siloUri) {
        const from = await this.wallets.jwkToAddress(jwk);
        const transaction = {};
        Object.assign(transaction, attributes);
        if (!attributes.data) {
            throw new Error(`Silo transactions must have a 'data' value`);
        }
        if (!siloUri) {
            throw new Error(`No Silo URI specified.`);
        }
        if (attributes.target || attributes.quantity) {
            throw new Error(`Silo transactions can only be used for storing data, sending AR to other wallets isn't supported.`);
        }
        if (attributes.owner == undefined) {
            transaction.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.wallets.getLastTransactionID(from);
        }
        const siloResource = await this.silo.parseUri(siloUri);
        if (typeof attributes.data == "string") {
            const encrypted = await this.crypto.encrypt(ArweaveUtils.stringToBuffer(attributes.data), siloResource.getEncryptionKey());
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength);
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
        }
        if (attributes.data instanceof Uint8Array) {
            const encrypted = await this.crypto.encrypt(attributes.data, siloResource.getEncryptionKey());
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength);
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
        }
        const siloTransaction = new Transaction(transaction);
        siloTransaction.addTag("Silo-Name", siloResource.getAccessKey());
        siloTransaction.addTag("Silo-Version", `0.1.0`);
        return siloTransaction;
    }
}
//# sourceMappingURL=arweave.js.map