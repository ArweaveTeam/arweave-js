#!/usr/bin/env node

const Arweave = require('../node');
const fs = require('fs');
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

const jwk = JSON.parse(process.env.WALLET_JSON)

async function testIt(file, resume) {
  const data = fs.readFileSync(file);
  
  for await (const progress of arweave.transactions.upload(resume, data)) {
    fs.writeFileSync(`${progress.transaction.id}.progress.json`, JSON.stringify(progress));
    console.log(`${progress.transaction.id} - ${progress.pctComplete}% - ${progress.uploadedChunks}/${progress.totalChunks}`)
  }

  return resume.transaction.id;
}

const file = process.argv.slice(-2)[0];
const resume = JSON.parse(fs.readFileSync(process.argv.slice(-1)[0]).toString());

testIt(file, resume)
  .then(x => console.log(x))
  .catch(e => console.error(e))
