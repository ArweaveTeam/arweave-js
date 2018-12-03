"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class ArweaveError extends Error {
    constructor(type, optional) {
        if (optional.message) {
            super(optional.message);
        }
        else {
            super();
        }
        this.type = type;
        this.response = optional.response;
    }
    getType() {
        return this.type;
    }
}
exports.ArweaveError = ArweaveError;
//# sourceMappingURL=error.js.map