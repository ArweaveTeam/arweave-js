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

  console.log(`uploading tx ${tx.id}`);

  for await (const progress of arweave.transactions.upload(tx)) {
    fs.writeFileSync(`${tx.id}.progress.json`, JSON.stringify(progress));
    console.log(`${tx.id} - ${progress.pctComplete}% - ${progress.uploadedChunks}/${progress.totalChunks} - ${progress.lastResponseStatus} - ${progress.lastResponseError}`)
  }

  return tx.id;
}

const file = process.argv.slice(-1)[0];

testIt(file)
  .then(x => console.log(x))
  .catch(e => console.error(e))
