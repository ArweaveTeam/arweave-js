export class Network {
    constructor(api) {
        this.api = api;
    }
    info() {
        return this.api.get(`info`).then(response => {
            return response.data;
        });
    }
    peers() {
        return this.api.get(`peers`).then(response => {
            return response.data;
        });
    }
}
//# sourceMappingURL=network.js.map