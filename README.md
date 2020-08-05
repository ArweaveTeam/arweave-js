# Arweave JS

Arweave JS is the JavaScript/TypeScript SDK for interacting with the Arweave network and uploading data ot the permaweb. It works in latest browsers and Node JS.

- [Arweave JS](#arweave-js)
  - [Installation](#installation)
    - [NPM](#npm)
    - [Bundles](#bundles)
  - [Initialisation](#initialisation)
    - [NPM Node](#npm-node)
    - [NPM Web](#npm-web)
    - [Web Bundles](#web-bundles)
    - [Initialisation options](#initialisation-options)
  - [Usage](#usage)
    - [Wallets and Keys](#wallets-and-keys)
      - [Create a new wallet and private key](#create-a-new-wallet-and-private-key)
      - [Get the wallet address for a private key](#get-the-wallet-address-for-a-private-key)
      - [Get an address balance](#get-an-address-balance)
      - [Get the last transaction ID from a wallet](#get-the-last-transaction-id-from-a-wallet)
    - [Transactions](#transactions)
      - [Create a data transaction](#create-a-data-transaction)
      - [Create a wallet to wallet transaction](#create-a-wallet-to-wallet-transaction)
      - [Add tags to a transaction](#add-tags-to-a-transaction)
      - [Sign a transaction](#sign-a-transaction)
      - [Submit a transaction](#submit-a-transaction)
        - [Chunked uploading advanced options](#chunked-uploading-advanced-options)
      - [Get a transaction status](#get-a-transaction-status)
      - [Get a transaction](#get-a-transaction)
      - [Get transaction data](#get-transaction-data)
      - [Decode data and tags from transactions](#decode-data-and-tags-from-transactions)
    - [ArQL](#arql)
    - [License](#license)

## Installation
### NPM
```bash
npm install --save arweave
```

### Bundles
Single bundle file (web only - use the NPM method if using Node).

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

### NPM Node
```js
const Arweave = require('arweave/node');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});
```

### NPM Web
```js
import Arweave from 'arweave/web';

// Since v1.5.1 you're now able to call the init function for the web version without options. The current path will be used by default, recommended.
const arweave = Arweave.init();

// Or manually specify a host
const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});
```

### Web Bundles
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello world</title>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
    <script>
    const arweave = Arweave.init();
    arweave.network.getInfo().then(console.log);
    </script>
</head>
<body>

</body>
</html>
```

### Initialisation options
```js
{
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
}
```

## Usage

### Wallets and Keys

#### Create a new wallet and private key

Here you can generate a new wallet address and private key ([JWK](https://docs.arweave.org/developers/server/http-api#key-format)), don't expose private keys or make them public as anyone with the key can use the corresponding wallet.

Make sure they're stored securely as they can never be recovered if lost.

Once AR has been sent to the address for a new wallet, the key can then be used to sign outgoing transactions.
```js
arweave.wallets.generate().then((key) => {
    console.log(key);
    // {
    //     "kty": "RSA",
    //     "n": "3WquzP5IVTIsv3XYJjfw5L-t4X34WoWHwOuxb9V8w...",
    //     "e": ...
});
```

#### Get the wallet address for a private key

```js
arweave.wallets.jwkToAddress(key).then((address) => {
    console.log(address);
    //1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
});
```

#### Get an address balance
Get the balance of a wallet address, all amounts by default are returned in [winston](https://docs.arweave.org/developers/server/http-api#ar-and-winston).
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

Transactions are the building blocks of the Arweave permaweb, they can send [AR](https://docs.arweave.org/developers/server/http-api#ar-and-winston) betwen wallet addresses, or store data on the Arweave network.

The create transaction methods simply creates and returns an unsigned transaction object, you must sign the transaction and submit it separeately using the `transactions.sign` and `transactions.submit` methods.

**Modifying a transaction object after signing it will invalidate the signature**, this will cause it to be rejected by the network if submitted in that state. Transaction prices are based on the size of the data field, so modifying the data field after a transaction has been created isn't recommended as you'll need to manually update the price.

The transaction ID is a hash of the transaction signature, so a transaction ID can't be known until its contents are finalised and it has been signed.

#### Create a data transaction

Data transactions are used to store data on the Arweave permaweb, they can contain HTML data and be serverd like webpages or they can contain any arbitrary data.

```js
let key = await arweave.wallets.generate();

// Plain text
let transactionA = await arweave.createTransaction({
    data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>'
}, key);

// Buffer
let transactionB = await arweave.createTransaction({
    data: Buffer.from('Some data', 'utf8')
}, key);


console.log(transactionA);
// Transaction {
//   format: 2,
//   id: 'ReUohI9tEmXQ6EN9H9IkRjY9bSdgql_OdLUCOeMEte0',
//   last_tx: 'Tk-0c7260Ya5zjfjzl4f6-W-vRO94qiqZMAScKBcYXc68v1Pd8bYfTbKWi7pepUF',
//   owner: 'kmM4O08BJB85RbxfQ2nkka9VNO6Czm2Tc_IGQNYCTSXRzO...',
//   tags: [],
//   target: '',
//   quantity: '0',
//   data: 'c29tZSBkYXRh',
//   data_size: '9',
//   data_root: 'qwKZUl7qWpCEmB3cpONKTYOcSmnmhb-_s8ggMTZwCU4',
//   data_tree: [],
//   reward: '7489274',
//   signature: 'JYdFPblDuT95ky7_wVss3Ax9e4Qygcd_lEcB07sDPUD_wNslOk...'
// }
```

#### Create a wallet to wallet transaction

```js
let key = await arweave.wallets.generate();

// Send 10.5 AR to 1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
let transaction = await arweave.createTransaction({
    target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
    quantity: arweave.ar.arToWinston('10.5')
}, key);

console.log(transaction);
// Transaction {
//   format: 2,
//   id: 'v-n7hAc7cubeXSClh0beaOs1RjYFagyvpl2TkUOfbRg',
//   last_tx: 'Tk-0c7260Ya5zjfjzl4f6-W-vRO94qiqZMAScKBcYXc68v1Pd8bYfTbKWi7pepUF',
//   owner: 'kmM4O08BJB85RbxfQ2nkka9VNO6Czm2Tc_IGQNYCTSXRzOc6W9b...',
//   tags: [],
//   target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
//   quantity: '10500000000000',
//   data: '',
//   data_size: '0',
//   data_root: '',
//   data_tree: [],
//   reward: '7468335',
//   signature: 'DnUOYbRSkhI4ZXg5fpYDCwPv8yvM5toAneSx4Jlg0zjIocqPs8giPP...'
// }
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
//   format: 2,
//   id: '',
//   last_tx: 'Tk-0c7260Ya5zjfjzl4f6-W-vRO94qiqZMAScKBcYXc68v1Pd8bYfTbKWi7pepUF',
//   owner: 'kmM4O08BJB85RbxfQ2nkka9VNO6Czm2Tc_IGQNYC...',
//   tags: [
//     Tag { name: 'Q29udGVudC1UeXBl', value: 'dGV4dC9odG1s' },
//     Tag { name: 'a2V5Mg', value: 'dmFsdWUy' }
//   ],
//   target: '',
//   quantity: '0',
//   data: 'PGh0bWw-PGhlYWQ-PG1ldGEgY2hhcnNldD0iVVRGLTgiPjx0aXRsZT5IZWxsbyB3b3JsZCE8L3RpdGxlPjwvaGVhZD48Ym9keT48L2JvZHk-PC9odG1sPg',
//   data_size: '88',
//   data_root: 'GQunzmbwk2_JPU7oJOmLrTMvj8v_7BJaF0weyjVn5Nc',
//   data_tree: [],
//   reward: '7673074',
//   signature: ''
// }
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
// Transaction {
//   format: 2,
//   id: 'v-n7hAc7cubeXSClh0beaOs1RjYFagyvpl2TkUOfbRg',
//   last_tx: 'Tk-0c7260Ya5zjfjzl4f6-W-vRO94qiqZMAScKBcYXc68v1Pd8bYfTbKWi7pepUF',
//   owner: 'kmM4O08BJB85RbxfQ2nkka9VNO6Czm2Tc_IGQNYCTSXRzOc6W9b...',
//   tags: [],
//   target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
//   quantity: '10500000000000',
//   data: '',
//   data_size: '0',
//   data_root: '',
//   data_tree: [],
//   reward: '7468335',
//   signature: 'DnUOYbRSkhI4ZXg5fpYDCwPv8yvM5toAneSx4Jlg0zjIocqPs8giPP...'
// }
```

#### Submit a transaction

The preferred method of submitting a data transaction is to use chunk uploading. This method will allow larger transaction sizes, resuming a transaction upload if its interrupted and give progress updates while uploading.

Simple example:

```js

let data = fs.readFileSync('path/to/file.pdf');

let transaction = await arweave.createTransaction({ data: data }, key);
transaction.addTag('Content-Type', 'application/pdf');

await arweave.transactions.sign(transaction, key);

let uploader = await arweave.transactions.getUploader(transaction);

while (!uploader.isComplete) {
  await uploader.uploadChunk();
  console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
}
```

You can also submit transactions using `transactions.post()` which is suitable for small transactions or token transfers:

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

##### Chunked uploading advanced options

You can resume an upload from a saved uploader object, that you have persisted in storage some using `JSON.stringify(uploader)` at any stage of the upload. To resume, parse it back into an object pass it to `getUploader()` along with the transactions data:

```js

let data = fs.readFileSync('path/to/file.pdf'); // get the same data
let resumeObject = JSON.parse(savedUploader); // get uploader object from where you stored it.

let uploader = await arweave.transactions.getUploader(resumeObject, data);
while (!uploader.isComplete) {
  await uploader.uploadChunk();
}

```

When resuming the upload, you *must provide the same data* as the original upload. When you serialize the uploader object with `JSON.stringify()` to save it somewhere, it will not include the data.

You can also resume an upload from just the transaction ID and data, once it has been mined into a block. This can be useful if you didn't save the uploader somewhere but the upload got interrupted. This will re-upload all of the data from the beginning, since we don't know which parts have been uploaded:

```js

let data = fs.readFileSync('path/to/file.pdf'); // get the same data
let resumeTxId = 'mytxid' // a transaction id for a mined transaction that didn't complete the upload.

let uploader = await arweave.transactions.getUploader(resumeTxId, data);
while (!uploader.isComplete) {
  await uploader.uploadChunks();
  console.log(`${progress.pctComplete}% complete`);
}
```

There is also a async iterator interface to chunk uploading, but this method means you'll need to ensure you are using a transpiler and polyfill for the asyncIterator symbol for some environments. (Safari on iOS in particular). This method takes the same arguments for uploading/resuming a transaction as `getUploader()` and just has a slightly shorter syntax:

```js
for await (const uploader of arweave.transactions.upload(tx) {
  console.log(`${uploader.pctComplete}% Complete`);
}
// done.
```

#### Get a transaction status

```js
arweave.transactions.getStatus('bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U').then(status => {
    console.log(status);
    // 200
})
```

#### Get a transaction

Fetch a transaction from the connected arweave node. The data and tags are base64 encoded, these can be decoded using the built in helper methods.

```js
const transaction = arweave.transactions.get('hKMMPNh_emBf8v_at1tFzNYACisyMQNcKzeeE1QE9p8').then(transaction => {
  console.log(transaction);
    // Transaction {
    //   'format': 1,
    //   'id': 'hKMMPNh_emBf8v_at1tFzNYACisyMQNcKzeeE1QE9p8',
    //   'last_tx': 'GW7p6NoGJ495tAoUjU5GLxIH52gqOgk5j78gQv3j0ebvldAlw6VgIUv_lrMNGI72',
    //   'owner': 'warLaSbicZm1nx9ucf-_5i91CWgmNOcnFJfyJdloCtsbenBhLrcGH472kKTZyuEAp2lSKlZ0NFCT2r2z-0...',
    //   'tags': [
    //     {
    //       'name': 'QXBwLU5hbWU',
    //       'value': 'd2VpYm90LXNlYXJjaC13ZWlicw'
    //     }
    //   ],
    //   'target': ',
    //   'quantity': '0',
    //   'data': 'iVBORw0KGgoAAAANSUhEUgAAArIAAADGCAYAAAAuVWN-AAAACXBIWXMAAAsSAAA...'
    //   'data_size': '36795',
    //   'data_tree': [],
    //   'data_root': ',
    //   'reward': '93077980',
    //   'signature': 'RpohCHVl5vzGlG4R5ybeEuhs556Jv7rWOGaZCT69cpIei_j9b9sAetBlr0...'
    // }
});
```

#### Get transaction data

You can get the transaction data from a transaction ID without having to get the entire transaction

```js
// Get the base64url encoded string
arweave.transactions.getData('bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U').then(data => {
  console.log(data);
  // CjwhRE9DVFlQRSBodG1sPgo...
});

// Get the data decoded to a Uint8Array for binary data
getData('bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U', {decode: true}).then(data => {
  console.log(data);
  // Uint8Array [10, 60, 33, 68, ...]
});

// Get the data decode as string data
arweave.transactions.getData('bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U', {decode: true, string: true}).then(data => {
  console.log(data);
  // <!DOCTYPE HTML>...
});
```

#### Decode data and tags from transactions

```js
const transaction = arweave.transactions.get('bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U').then(transaction => {

  // Use the get method to get a specific transaction field.
  console.log(transaction.get('signature'));
  // NLiRQSci56KVNk-x86eLT1TyF1ST8pzE-s7jdCJbW-V...

  console.log(transaction.get('data'));
  //CjwhRE9DVFlQRSBodG1sPgo8aHRtbCBsYW5nPSJlbiI-C...

  // Get the data base64 decoded as a Uint8Array byte array.
  console.log(transaction.get('data', {decode: true}));
  //Uint8Array[10,60,33,68,79,67,84,89,80,69...

  // Get the data base64 decoded as a string.
  console.log(transaction.get('data', {decode: true, string: true}));
  //<!DOCTYPE html>
  //<html lang="en">
  //<head>
  //    <meta charset="UTF-8">
  //    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //    <title>ARWEAVE / PEER EXPLORER</title>

  transaction.get('tags').forEach(tag => {
    let key = tag.get('name', {decode: true, string: true});
    let value = tag.get('value', {decode: true, string: true});
    console.log(`${key} : ${value}`);
  });
  // Content-Type : text/html
  // User-Agent : ArweaveDeploy/1.1.0
});
```

### ArQL

ArQL allows you to search for transactions by tags or by wallet address.

  The allowed operators are `and`, `or`, and `equals` which all accept exactly two expressions. Therefore, to `and` three or more expressions together, you will need to nest `and` expressions. The same goes for `or`. Searching by wallet is done by using the special tag `from`.

`arweave.arql` takes the ArQL query as an object and returns the matching transaction IDs as an array of strings.

```js
const txids = await arweave.arql({
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "hnRI7JoN2vpv__w90o4MC_ybE9fse6SUemwQeY8hFxM"
  },
  expr2: {
    op: "or",
    expr1: {
      op: "equals",
      expr1: "type",
      expr2: "post"
    },
    expr2: {
      op: "equals",
      expr1: "type",
      expr2: "comment"
    }
  }
})

console.log(txids)
// [
//   'TwS2G8mi5JGypMZO_EWtHKvrJkB76hXmWN3ROCjkLBc',
//   'urdjQI4iKo7l8xQ0A55G7bOM3oi4QdGAd7MeVE_ru5c',
//   '_CD8p7z3uFJCB03OCMU7R80FTQ3ZRf8O2UGhNxoUaOg',
//   ...
// ]
```

There are a number of community produced helper packages for building ArQL queries.

 - https://www.npmjs.com/package/arlang
 - https://www.npmjs.com/package/arql-ops

### License

This software is released under MIT license. See [LICENSE.md](./LICENSE.md) for full license details.
