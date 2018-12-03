import { ArweaveUtils } from './utils';
class BaseObject {
    get(field, options) {
        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }
        if (options && options.decode == true) {
            if (options && options.string) {
                return ArweaveUtils.b64UrlToString(this[field]);
            }
            return ArweaveUtils.b64UrlToBuffer(this[field]);
        }
        return this[field];
    }
}
export class Tag extends BaseObject {
    constructor(name, value, decode = false) {
        super();
        this.name = name;
        this.value = value;
    }
}
export class Transaction extends BaseObject {
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
        this.tags.push(new Tag(ArweaveUtils.stringToB64Url(name), ArweaveUtils.stringToB64Url(value)));
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
        return ArweaveUtils.concatBuffers([
            this.get('owner', { decode: true, string: false }),
            this.get('target', { decode: true, string: false }),
            this.get('data', { decode: true, string: false }),
            ArweaveUtils.stringToBuffer(this.quantity),
            ArweaveUtils.stringToBuffer(this.reward),
            this.get('last_tx', { decode: true, string: false }),
            ArweaveUtils.stringToBuffer(tagString)
        ]);
    }
}
//# sourceMappingURL=Transaction.js.map