"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ar_1 = require("./ar");
const api_1 = require("./lib/api");
const network_1 = require("./network");
const transactions_1 = require("./transactions");
const wallets_1 = require("./wallets");
const transaction_1 = require("./lib/transaction");
const utils_1 = require("./lib/utils");
const silo_1 = require("./silo");
class Arweave {
    constructor(config) {
        this.crypto = config.crypto;
        this.api = new api_1.Api(config.api);
        this.wallets = new wallets_1.Wallets(this.api, config.crypto);
        this.transactions = new transactions_1.Transactions(this.api, config.crypto);
        this.silo = new silo_1.Silo(this.api, this.crypto, this.transactions);
        this.network = new network_1.Network(this.api);
        this.ar = new ar_1.Ar;
        this.utils = utils_1.ArweaveUtils;
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
            attributes.data = utils_1.ArweaveUtils.stringToB64Url(attributes.data);
        }
        return new transaction_1.Transaction(attributes);
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
        const siloResource = await this.silo.parseUri(siloUri);
        const encrypted = await this.crypto.encrypt(utils_1.ArweaveUtils.stringToBuffer(attributes.data), siloResource.getEncryptionKey());
        attributes.data = utils_1.ArweaveUtils.bufferTob64Url(encrypted);
        return new transaction_1.Transaction(attributes);
    }
}
exports.Arweave = Arweave;
//# sourceMappingURL=arweave.js.map