"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arweave_1 = require("./arweave/arweave");
const node_driver_1 = require("./arweave/lib/crypto/node-driver");
function init(apiConfig) {
    return new arweave_1.Arweave({
        api: apiConfig,
        crypto: new node_driver_1.NodeCryptoDriver
    });
}
exports.init = init;
//# sourceMappingURL=node.js.map