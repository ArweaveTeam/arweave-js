Arweave JS

Arweave JS is the JavaScript/TypeScript SDK for interacting with the Arweave network and uploading data ot the permaweb, it works in latest browsers and Node JS.



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

Transactions are the building blocks of the Arweave permaweb, they can send [AR](https://docs.arweave.org/developers/server/http-api#ar-and-winston) betwen wallet addresses, or store data on the arweave network.

The create transaction methods simple create and return an unsigned transaction object, you must sign the transaction and submit it separeately using the transactions.sign and transactions.submit methods.

**Modifying a transaction object after signing it will invalidate the signature**, this will cause it to be rejected by the network if submitted in that state. Transaction prices are based on the size of the data field, so modifying the data field after a transaction has been created isn't recommended as you'll need to manually update the price.

The transaction ID is a hash of the transaction signature, so a transaction ID can't be known until its contents are finalised and it has been signed.

#### Create a data transaction

Data transactions are used to store data on the Arweave permaweb, they can contain HTML data and be serverd like webpages or they can contain any arbitrary data.

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
//   owner: 'wgfbaaSXJ8dszMabPo-...',
//   tags: [],
//   target: '',
//   quantity: '0',
//   data: 'eyJhIjoxfQ',
//   reward: '321879995',
//   signature: '' }
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
//   owner: '14fXfoRDMFS5yTpUT7ODzj...',
//   tags: [],
//   target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
//   quantity: '10500000000000',
//   data: '',
//   reward: '2503211
//   signature: '' }
```

#### Add tags to a transaction

Metadata can be added to transactions through tags, these are simple key/value attributes that can be used to document the contents of a transaction or provide related data.

ARQL uses tags when searching for transactions.

The `Content-Type` is a reserved tag and is used to set the data content type. For example, a transaction with HTML data and a content type tag of `text/html` will be served as a HTML page and render correctly in browsers,
if the content type is set to `text/plain` then it will be served as a plain text document and not render in browsers.

```js
let key = await arweave.wallets.generate();

let transaction = await arweave.createTransaction({
    data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>',
}, key);

transaction.addTag('Content-Type', 'text/html');
transaction.addTag('key2', 'value2');

console.log(transaction);
// Transaction {
//   last_tx: '',
//   owner: 's8zPWNlBMiJFLcvpH98QxnI6FoPar3vCK3RdT...',
//   tags: [
//       Tag { name: 'Q29udGVudC1UeXBl', value: 'dGV4dC9odG1s' },
//       Tag { name: 'a2V5Mg', value: 'dmFsdWUy' }
//   ],
//   target: '',
//   quantity: '0',
//   data: 'PGh0bWw-PGhlYWQ-PG1ldGEgY2hh...',
//   reward: '329989175',
//   signature: '' }
```

#### Sign a transaction

```js
let key = await arweave.wallets.generate();

let transaction = await arweave.createTransaction({
    target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
    quantity: arweave.ar.arToWinston('10.5')
}, key);

await arweave.transactions.sign(transaction, key);

console.log(transaction);
// Signature and id fields are now populated
// Transaction {
//   last_tx: '',
//   owner: '2xu89EaA5zENRRsbOh4OscMcy...',
//   tags: [],
//   target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
//   quantity: '10500000000000',
//   data: '',
//   reward: '250321179212',
//   signature: 'AbFjlpEHTN6_SKWsUSMAzalImOVxNm86Z8hoTZcItkYBJLx...'
//   id: 'iHVHijWvKbIa0ZA9IbuKtOxJdNO9qyey6CIH324zQWI' 
```

#### Submit a transaction

```js
let key = await arweave.wallets.generate();

let transaction = await arweave.createTransaction({
    target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
    quantity: arweave.ar.arToWinston('10.5')
}, key);

await arweave.transactions.sign(transaction, key);

const response = await arweave.transactions.post(transaction);

console.log(response.status);
// 200

// HTTP response codes (200 - ok, 400 - invalid transaction, 500 - error)
```