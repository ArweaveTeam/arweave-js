"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class BaseObject {
    get(field, options) {
        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }
        if (options && options.decode == true) {
            if (options && options.string) {
                return utils_1.ArweaveUtils.b64UrlToString(this[field]);
            }
            return utils_1.ArweaveUtils.b64UrlToBuffer(this[field]);
        }
        return this[field];
    }
}
class Tag extends BaseObject {
    constructor(name, value, decode = false) {
        super();
        this.name = name;
        this.value = value;
    }
}
exports.Tag = Tag;
class Transaction extends BaseObject {
    constructor(attributes) {
        super();
        this.last_tx = '';
        this.owner = '';
        this.tags = [];
        this.target = '';
        this.quantity = '0';
        this.data = '';
        this.reward = '0';
        this.signature = '';
        Object.assign(this, attributes);
    }
    addTag(name, value) {
        this.tags.push(new Tag(utils_1.ArweaveUtils.stringToB64Url(name), utils_1.ArweaveUtils.stringToB64Url(value)));
    }
    toJSON() {
        return {
            id: this.id,
            last_tx: this.last_tx,
            owner: this.owner,
            tags: this.tags,
            target: this.target,
            quantity: this.quantity,
            data: this.data,
            reward: this.reward,
            signature: this.signature
        };
    }
    setSignature({ signature, id }) {
        this.signature = signature;
        this.id = id;
    }
    getSignatureData() {
        let tagString = this.tags.reduce((accumulator, tag) => {
            return accumulator + '' + tag.get('name', { decode: true, string: true }) + '' + tag.get('value', { decode: true, string: true });
        }, '');
        return utils_1.ArweaveUtils.concatBuffers([
            this.get('owner', { decode: true, string: false }),
            this.get('target', { decode: true, string: false }),
            this.get('data', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(this.quantity),
            utils_1.ArweaveUtils.stringToBuffer(this.reward),
            this.get('last_tx', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(tagString)
        ]);
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map