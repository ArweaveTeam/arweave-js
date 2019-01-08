import * as chai from 'chai';

const expect = chai.expect;

describe('Node distribution', function () {
    it('should initilize from compiled node dist', async function () {

        const dist = require('../dist/node/node');

        expect(dist).to.be.a('object');

        expect(dist.init).to.be.a('function');

        const instance = dist.init({ host: 'arweave.net', port: 1984, logging: false });

        expect(instance.api.constructor.name).to.equal('Api')

        expect(instance.transactions.constructor.name).to.equal('Transactions');

        expect(instance.wallets.constructor.name).to.equal('Wallets');

        expect(instance.network.constructor.name).to.equal('Network');

        expect(instance.crypto.constructor.name).to.equal('NodeCryptoDriver');
    })
});


describe('Web distribution', function () {
    it('should initilize from web compiled dist', async function () {

        // The web distro will attach to the browser window so we just
        // need to mock a global window object with a subtle crypto stub
        // to make this test work.
        let globals = (<any>global);

        globals.window = {
            crypto: {
                subtle: {
                    generateKey: async () => { },
                    importKey: async () => { },
                    exportKey: async () => { },
                    digest: async () => { },
                    sign: async () => { },
                }
            }
        };

        require('../dist/web/web');

        const dist = globals.window.Arweave;

        expect(dist).to.be.a('object');

        expect(dist.init).to.be.a('function');

        const instance = dist.init({ host: 'arweave.net', port: 1984, logging: false });

        expect(instance.api.constructor.name).to.equal('Api')

        expect(instance.transactions.constructor.name).to.equal('Transactions');

        expect(instance.wallets.constructor.name).to.equal('Wallets');

        expect(instance.network.constructor.name).to.equal('Network');

        expect(instance.crypto.constructor.name).to.equal('WebCryptoDriver');

    })

    it('should initilize from web bundle', async function () {

        // The web distro will attach to the browser window so we just
        // need to mock a global window object with a subtle crypto stub
        // to make this test work.
        let globals = (<any>global);

        globals.window = {
            crypto: {
                subtle: {
                    generateKey: async () => { },
                    importKey: async () => { },
                    exportKey: async () => { },
                    digest: async () => { },
                    sign: async () => { },
                }
            }
        };

        require('../dist/web.bundle');

        const dist = globals.window.Arweave;

        expect(dist).to.be.a('object');

        expect(dist.init).to.be.a('function');

        const instance = dist.init({ host: 'arweave.net', port: 1984, logging: false });

        expect(instance.api.constructor.name).to.equal('Api')

        expect(instance.transactions.constructor.name).to.equal('Transactions');

        expect(instance.wallets.constructor.name).to.equal('Wallets');

        expect(instance.network.constructor.name).to.equal('Network');

        expect(instance.crypto.constructor.name).to.equal('WebCryptoDriver');

    })
});
