import { Ar } from "./ar";
import { Api } from "./lib/api";
import { Network } from "./network";
import { Transactions } from './transactions';
import { Wallets } from './wallets';
import { Transaction } from "./lib/transaction";
import { ArweaveUtils } from "./lib/utils";
import { Silo } from './silo';
export class Arweave {
    constructor(config) {
        this.crypto = config.crypto;
        this.api = new Api(config.api);
        this.wallets = new Wallets(this.api, config.crypto);
        this.transactions = new Transactions(this.api, config.crypto);
        this.silo = new Silo(this.api, this.crypto, this.transactions);
        this.network = new Network(this.api);
        this.ar = new Ar;
        this.utils = ArweaveUtils;
    }
    getConfig() {
        return {
            api: this.api.getConfig(),
            crypto: null
        };
    }
    async createTransaction(attributes, jwk) {
        if (!attributes.data && !(attributes.target && attributes.quantity)) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`);
        }
        let from = await this.wallets.jwkToAddress(jwk);
        if (attributes.owner == undefined) {
            attributes.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            attributes.last_tx = await this.wallets.getLastTransactionID(from);
        }
        if (attributes.reward == undefined) {
            let length = (typeof attributes.data == 'string' && attributes.data.length > 0) ? attributes.data.length : 0;
            let target = (typeof attributes.target == 'string' && attributes.target.length > 0) ? attributes.target : null;
            attributes.reward = await this.transactions.getPrice(length, target);
        }
        if (attributes.data) {
            attributes.data = ArweaveUtils.stringToB64Url(attributes.data);
        }
        return new Transaction(attributes);
    }
    async createSiloTransaction(attributes, jwk, siloUri) {
        if (!attributes.data) {
            throw new Error(`Silo transactions must have a 'data' value`);
        }
        if (!siloUri) {
            throw new Error(`No Silo URI specified.`);
        }
        if (attributes.target || attributes.quantity) {
            throw new Error(`Silo transactions can only be used for storing data, sending AR to other wallets isn't supported.`);
        }
        let from = await this.wallets.jwkToAddress(jwk);
        if (attributes.owner == undefined) {
            attributes.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            attributes.last_tx = await this.wallets.getLastTransactionID(from);
        }
        if (attributes.reward == undefined) {
            let length = (typeof attributes.data == 'string' && attributes.data.length > 0) ? attributes.data.length : 0;
            attributes.reward = await this.transactions.getPrice(length);
        }
        return new Transaction(attributes);
    }
}
//# sourceMappingURL=arweave.js.map