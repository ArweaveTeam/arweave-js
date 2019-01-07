import * as chai from 'chai';
import * as Arweave from "../src/node";
import { Api } from '../src/arweave/lib/api';
import { Wallets } from '../src/arweave/wallets';
import { Network } from '../src/arweave/network';
import { Transactions } from '../src/arweave/transactions';
import { NodeCryptoDriver } from '../src/arweave/lib/crypto/node-driver';
import { Transaction } from '../src/arweave/lib/transaction';

const expect = chai.expect;

const arweave = Arweave.init({ host: 'arweave.net', port: 1984, logging: false });

const digestRegex = /[a-zA-Z0-9-_]{43}/;
const liveAddressBalance = '0000000000004985570556';
const liveAddress = '9_666Wkk2GzL0LGd3xhb0jY7HqNy71BaV4sULQlJsBQ';
const liveTxid = 'glHacTmLlPSw55wUOU-MMaknJjWWHBLN16U8f3YuOd4';

describe('Initialization', function () {
    it('should have components', function () {

        expect(arweave.api).to.be.an.instanceOf(Api);

        expect(arweave.transactions).to.be.an.instanceOf(Transactions);

        expect(arweave.wallets).to.be.an.instanceOf(Wallets);

        expect(arweave.network).to.be.an.instanceOf(Network);

        expect(arweave.crypto).to.be.an.instanceOf(NodeCryptoDriver);

    })
});

describe('Wallets and keys', function () {

    it('should generate valid JWKs', async function () {

        const walletA = await arweave.wallets.generate();
        const walletB = await arweave.wallets.generate();

        expect(walletA).to.be.an('object', 'New wallet is not an object');

        expect(walletA).to.have.all.keys('kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi');

        const addressA = await arweave.wallets.jwkToAddress(walletA);
        const addressB = await arweave.wallets.jwkToAddress(walletB);

        expect(addressA).to.be.a('string');

        expect(addressA).to.match(digestRegex);

        expect(addressB).to.match(digestRegex);

        expect(addressA).to.not.equal(addressB);

    })

    it('should get wallet info', async function () {

        const wallet = await arweave.wallets.generate();

        const address = await arweave.wallets.jwkToAddress(wallet);

        const balance = await arweave.wallets.getBalance(address);

        const lastTx = await arweave.wallets.getLastTransactionID(address);

        expect(balance).to.be.a('string');

        expect(balance).to.equal('0');

        expect(lastTx).to.be.a('string');

        expect(lastTx).to.equal('');

        const balanceB = await arweave.wallets.getBalance(liveAddress);

        const lastTxB = await arweave.wallets.getLastTransactionID(liveAddress);

        expect(balance).to.be.a('string');

        expect(balance).to.equal(liveAddressBalance);

        expect(lastTx).to.be.a('string');

        expect(lastTx).to.match(digestRegex);
    })

    it('Transactions', async function () {

        const wallet = await arweave.wallets.generate();

        const transaction = await arweave.createTransaction({ data: 'test' }, wallet);

        expect(transaction).to.be.an.instanceOf(Transaction);

        await arweave.transactions.sign(transaction, wallet);

        expect(transaction.signature).to.match(/[a-zA-Z0-9-_]+/);

        expect(transaction.id).to.match(digestRegex);

        console.log('id');

        const verified = await arweave.transactions.verify(transaction)

        expect(verified).to.be.true;

        expect(verified).to.be.a('boolean');
    })


});
