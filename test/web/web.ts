import * as chai from 'chai';
import * as crypto from 'crypto';
import { ArweaveUtils } from '../../src/arweave/lib/utils';
import { Transaction } from '../../src/arweave/lib/transaction';

const expect = chai.expect;

let globals = (<any>global);

// globals.window = { Arweave: {} };

//@ts-ignore
const arweave = window.Arweave.init({ host: 'arweave.net', port: 1984, logging: false });

//@ts-ignore
window.arweave = arweave;

const digestRegex = /^[a-z0-9-_]{43}$/i;
const liveAddressBalance = '498557055636';
const liveAddress = '9_666Wkk2GzL0LGd3xhb0jY7HqNy71BaV4sULQlJsBQ';
const liveTxid = 'CE-1SFiXqWUEu0aSTebE6LC0-5JBAc3IAehYGwdF5iI';

const liveDataTxid = 'Ie-fxxzdBweiA0N1ZbzUqXhNI310uDUmaBc3ajlV6YY';

describe('Initialization', function () {
    it('should have components', function () {

        expect(arweave.api.constructor.name).to.equal('Api')

        expect(arweave.transactions.constructor.name).to.equal('Transactions');

        expect(arweave.wallets.constructor.name).to.equal('Wallets');

        expect(arweave.network.constructor.name).to.equal('Network');

        expect(arweave.crypto.constructor.name).to.equal('WebCryptoDriver');

        expect(arweave.silo.constructor.name).to.equal('Silo');

    })
});


describe('Network Info', function () {
    it('should get network info', async function () {

        this.timeout(3000);

        const info = await arweave.network.getInfo();
        const peers = await arweave.network.getPeers();

        expect(info).to.be.an('object')

        expect(Object.keys(info)).to.contain.members(['height', 'current', 'release', 'version', 'blocks']);

        expect(info.height).to.be.a('number').greaterThan(0);

        expect(peers).to.be.an('array');
    })
})

describe('Wallets and keys', function () {

    it('should generate valid JWKs', async function () {

        this.timeout(15000);

        const walletA = await arweave.wallets.generate();
        const walletB = await arweave.wallets.generate();

        expect(walletA).to.be.an('object', 'New wallet is not an object');

        expect(walletA).to.have.all.keys('kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi');

        expect(walletA.kty).to.equal('RSA');

        expect(walletA.e).to.equal('AQAB');

        expect(walletA.n).to.match(/^[a-z0-9-_]{683}$/i);

        expect(walletA.d).to.match(/^[a-z0-9-_]{683}$/i);

        const addressA = await arweave.wallets.jwkToAddress(walletA);
        const addressB = await arweave.wallets.jwkToAddress(walletB);

        expect(addressA).to.be.a('string');

        expect(addressA).to.match(digestRegex);

        expect(addressB).to.match(digestRegex);

        expect(addressA).to.not.equal(addressB);

    })

    it('should get wallet info', async function () {

        this.timeout(5000);

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

        expect(balanceB).to.be.a('string');

        expect(balanceB).to.equal(liveAddressBalance);

        expect(lastTxB).to.be.a('string');

        expect(lastTxB).to.equal(liveTxid);
    })

})


describe('Transactions', function () {

    it('should create and sign transactions', async function () {

        this.timeout(5000);

        const wallet = await arweave.wallets.generate();

        const transaction = await arweave.createTransaction({ data: 'test' }, wallet);

        transaction.addTag('test-tag-1', 'test-value-1');
        transaction.addTag('test-tag-2', 'test-value-2');
        transaction.addTag('test-tag-3', 'test-value-3');

        expect(transaction.constructor.name).to.equal('Transaction');

        expect(transaction.data).to.equal('dGVzdA');

        expect(transaction.last_tx).to.equal('');

        expect(transaction.reward).to.match(/^[0-9]+$/);

        await arweave.transactions.sign(transaction, wallet);

        expect(transaction.signature).to.match(/^[a-z0-9-_]+$/i);

        expect(transaction.id).to.match(digestRegex);

        const verified = await arweave.transactions.verify(transaction)

        expect(verified).to.be.a('boolean');

        expect(verified).to.be.true;

        //@ts-ignore
        // Needs ts-ignoring as tags are readonly so chaning the tag like this isn't 
        // normally an allowed operation, but it's a test, so...
        transaction.tags[1].value = 'dGVzdDI';

        const verifiedWithModififedTags = await arweave.transactions.verify(transaction)

        expect(verifiedWithModififedTags).to.be.a('boolean');

        expect(verifiedWithModififedTags).to.be.false;

    })


    it('should get transaction info', async function () {

        this.timeout(5000);

        const transactionStatus = await arweave.transactions.getStatus(liveDataTxid);
        const transaction = await arweave.transactions.get(liveDataTxid);

        expect(transactionStatus).to.be.a('number');

        expect(transactionStatus).to.equal(200);

        expect(transaction.get('data', { decode: true, string: true })).to.contain('<title>Releases · ArweaveTeam/arweave</title>');

        expect(await arweave.transactions.verify(transaction)).to.be.true;

        transaction.signature = 'xxx';

        const verifyResult = await (() => {
            return new Promise((resolve) => {
                arweave.transactions.verify(transaction).catch((error: any) => {
                    resolve(error);
                })
            })
        })();

        expect(verifyResult).to.be.an.instanceOf(Error).with.property('message').and.match(/^.*invalid transaction signature.*$/i)

    })

    it('should post transactions', async function () {

        this.timeout(5000);

        const wallet = await arweave.wallets.generate();

        const transaction = await arweave.createTransaction({ data: 'test' }, wallet);

        const unsignedResponse = await arweave.transactions.post(transaction);

        expect(unsignedResponse.status).to.be.a('number');

        // Unsigned transactions shouldn't be accepted (current implementation returns 500)
        expect(unsignedResponse.status).to.equal(500);

        await arweave.transactions.sign(transaction, wallet);

        const signedResponse = await arweave.transactions.post(transaction);

        expect(signedResponse.status).to.be.a('number');

        expect(signedResponse.status).to.not.equal(500);

    })

    it('should find transactions', async function () {

        this.timeout(5000);

        const results = await arweave.transactions.search('Silo-Name', 'BmjRGIsemI77+eQb4zX8');

        expect(results).to.be.an('array').which.contains('Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE')
    })

})

describe('Encryption', function () {
    it('should encrypt and decrypt using key round trip', async function () {

        this.timeout(5000);

        const text = 'some data to encrypt';

        const data = ArweaveUtils.stringToBuffer(text);

        const key = crypto.randomBytes(32);

        const encrypted = await arweave.crypto.encrypt(data, key);

        expect(encrypted).to.have.lengthOf(48);

        const decrypted = await arweave.crypto.decrypt(encrypted, key);

        expect(ArweaveUtils.bufferToString(decrypted)).to.equal(text);
    })

    it('should encrypt and decrypt using passphrase round trip', async function () {

        this.timeout(5000);

        const text = 'some data to encrypt';

        const data = ArweaveUtils.stringToBuffer(text);

        const key = 'super-secret-password';

        const encrypted = await arweave.crypto.encrypt(data, key);

        expect(encrypted).to.have.lengthOf(48);

        const decrypted = await arweave.crypto.decrypt(encrypted, key);

        expect(ArweaveUtils.bufferToString(decrypted)).to.equal(text);

    })
})

describe('Silo Web', function () {
    it('should read Silo transaction', async function () {

        this.timeout(5000);

        // This is a manually generated silo transaction
        // data = 'something'
        // uri = 'secret.1'
        const transaction = new Transaction({
            last_tx: '',
            owner:
                '2xkkxcnA0HyqpFqR1g14rnyiF_zZKZ_2EMVos3lb0Vd8l6RxKGumxTrFairo5fMLmTvrokYVNhl_ohmZvRVojwBC3nbbrY2mLpBWgwgpIXgcFug6GMu2p1W730IYCvi4EYpWDYx5sj_IzyMrDB7FB9jabl2AAefSrAdTfsmlg8f1WVJRp2SwPq3BqeUyHy7X1XNq7Bh6DBekbbywQgnX5zL2G2o8ySmeg72EFlH5T5dKbGqP6AIhRD7My8F1cq2MUe5ov1teLZeNhgnBZGoOoJmhqnimYkCY4e7jIrhZojHuDMidFLKkAORso6WlHZPWxVKo14xkRTBpNokwB6Crf9kJ-yNbjqagbhztf5ovrlGfNVtTZp3lt2btUzEyKHHIDjnb4r3HpF6dklGbGQjSoboZ67Os5fz44trAbz8HbtjmoGYdjzziO6Svpd_DX0YDyDai1lLR1c7CERuLGXOPCWyn0g9uEXkjJzdAM3BUlsfIZMdlZnN66EWoRUor9xZQkH3MitzTxPV8Eph2vtIJKDN7hybwp5EhNxJlaGA3sjG_Fhc1esntyo0W80wpFcAbwKp1gARqTeR1xsfsj-LuzFRNIK-wj5z6jQMVD5Dxu6wwT9RkVu-kZrL-rN56uGsfPQgXpurL0WyZzBM2MbrbQTd1aDR_rkl9khhCM3X--8k',
            target: '',
            quantity: '0',
            data: 'euyLRlvfca996OV5ayXwHboUNNxIiapq-I-II6zuQHo',
            reward: '322080219',
            signature:
                'yiZRcHcOxTMQm6gkpxrt9i9Zzok_PGlPeNBwyl_EhAbvJDie_CEkbxhegoK57UzVTczAiG7hGFvAawT_NAwvqTw5pF1v7OooIYDowQvTBnHBIXzOMVTqUjL5HwZ8DrJZrY9HJ6XSmERivNYwXrwloDuDCYYBv1cTCoRBt43BTaVFRzYZdccQXla89VN6HYDHszzAIgONfhdkv5LtChaZqQgdugrr8JAgWqjyvP02uL_tB_cEsumyOhXkFpQlHjIbTlqCxA4Hr06U6S37EfScztKbqwkKxS_J73nNO2HvGgy0NBxY52_BCzQs3tBdGnd3UQn5TcqXBYSYW082mIU4eCHqa1sCj60V7cfOlUwk_1tZOgtOQt9Kx2N6qTmZs1vlQjcPhmyLRLTFrLXPw7bHpTfLGE4AEG0kcIcKCvSSxjSaN_n-LvITmSFQ05Wb8EMQFo9pUDrFjpsum4rSq2hevfB51FDJCpAQ_57Hd1infcTKs32Yom5FR4WXp9Yr0G1DpQJIh5XbkczkRIYXtk8l6j7pY1DZ4rnm7INLTXL75e4YKxW-jlOKIILE8oyJkmgd4kA-BjVZ7FsiD0MjX0c5PRo0sX6rf7VATeG8l5vvGn2XDQyXlWYAKCzUJvGr-Z5TYakPE5yawvFUA5qXav_jH_Cw4qx-rzNpnvNRiQko5i8',
            id: 'aBrnjAQG07iVziQkrlNaZUs7kpUN9zjqqpXC7rkgGf0'
        });

        let decrypted = await arweave.silo.readTransactionData(transaction, 'secret.1');

        expect(ArweaveUtils.bufferToString(decrypted)).to.be.a('string').and.equal('something');
    })

    it('should pass a Silo transaction roundtrip', async function () {

        this.timeout(10000);

        const wallet = await arweave.wallets.generate();

        const transaction = await arweave.createSiloTransaction({ data: 'test data' }, wallet, 'my-silo-ref.1');

        let decrypted = await arweave.silo.readTransactionData(transaction, 'my-silo-ref.1');

        expect(ArweaveUtils.bufferToString(decrypted)).to.be.a('string').and.equal('test data');
    });

})
