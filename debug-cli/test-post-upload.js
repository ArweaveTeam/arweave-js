#!/usr/bin/env node

const Arweave = require('../node');
const fs = require('fs');
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

const jwk = JSON.parse(process.env.WALLET_JSON)


async function testIt(file) {
  const data = fs.readFileSync(file);
  const tx = await arweave.createTransaction({ data }, jwk);
  tx.addTag('Test', 'Yes');
  await arweave.transactions.sign(tx, jwk);
  tx.addTag('Foo', 'whut');
  
  const resp = await arweave.transactions.post(tx);
  console.log(resp.status);
  console.log(resp.statusText);
  return tx.id;
}

const file = process.argv.slice(-1)[0];

testIt(file)
  .then(x => console.log(x))
  .catch(e => console.error(e))
