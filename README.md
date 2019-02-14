arweave-js


## Installation
NPM
```bash
npm install --save arweave
```

Single bundle file (web only - use the NPM method if using Node)

```html
<!-- Latest -->
<script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>

<!-- Latest, minified-->
<script src="https://unpkg.com/arweave/bundles/web.bundle.min.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/arweave@1.2.0/bundles/web.bundle.js"></script>

<!-- Specific version, minified -->
<script src="https://unpkg.com/arweave@1.2.0/bundles/web.bundle.min.js"></script>
```


## Initialisation

NPM Node
```js
const Arweave = require('arweave/node');
```
```js
const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984
});
```

NPM Web
```js
import * as Arweave from 'arweave/web';
```


```js
const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984
});
```

The default port for nodes is `1984`.

A live list of public arweave nodes and IP adddresses can be found on this [peer explorer](http://arweave.net/bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U).


### Initialisation options
```js
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 80,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});
```

## Usage

### Wallets and Keys

#### Create a new wallet and JWK

Here you can generate a new [JWK](https://docs.arweave.org/developers/server/http-api#key-format), these are private keys so don't expose them or make them public. Make sure they're secured as they can't be recovered if lost.

Once AR has been sent to the address for a new wallet, the JWK can then be used to sign outgoing transactions.
```js
arweave.wallets.generate().then((jwk) => {
    console.log(jwk);
    // {
    //     "kty": "RSA",
    //     "n": "3WquzP5IVTIsv3XYJjfw5L-t4X34WoWHwOuxb9V8w...",
    //     "e": ...

    arweave.wallets.jwkToAddress(jwk).then((address) => {
        console.log(address);
        // 1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
    )};
});
```

#### Get the wallet address for a private key

```js
arweave.wallets.jwkToAddress(jwk).then((address) => {
    console.log(address);
    //1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
)};
```

#### Get a wallet balance
Get the balance of a wallet, all amounts by default are returned in [winston](https://docs.arweave.org/developers/server/http-api#ar-and-winston).
```js
arweave.wallets.getBalance('1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY').then((balance) => {
    let winston = balance;
    let ar = arweave.ar.winstonToAr(balance);

    console.log(winston);
    //125213858712

    console.log(ar);
    //0.125213858712
});
```

#### Get the last transaction ID from a wallet

```js
arweave.wallets.getLastTransactionID('1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY').then((transactionId) => {
    console.log(transactionId);
    //3pXpj43Tk8QzDAoERjHE3ED7oEKLKephjnVakvkiHF8
});
```

### Transactions

#### Create a data transaction

```js
let key = await arweave.wallets.generate();

// Plain text
let transactionA = arweave.createTransaction({
    data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>'
}, jwk);

// Buffer
let transactionB = arweave.createTransaction({
    data: Buffer.from('Some data', 'utf8')
}, jwk);


console.log(transactionA);
// Transaction {
//   last_tx: '',
//   owner:
//    'wgfbaaSXJ8dszMabPo-...',
//   tags: [],
//   target: '',
//   quantity: '0',
//   data: 'eyJhIjoxfQ',
//   reward: '321879995',
  signature: '' }
```

#### Create a wallet to wallet transaction

```js
let key = await arweave.wallets.generate();

// Send 10.5 AR to 1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
let transaction = arweave.createTransaction({
    target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
    quantity: arweave.ar.arToWinston('10.5')
}, jwk);

console.log(transaction);
// Transaction {
//   last_tx: '',
//   owner:
//    '14fXfoRDMFS5yTpUT7ODzj...',
//   tags: [],
//   target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
//   quantity: '10500000000000',
//   data: '',
//   reward: '2503211
```
