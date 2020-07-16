#!/usr/bin/env node

const Arweave = require('../node');
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

async function testIt(id) {
  
  const offsetResponse = await arweave.chunks.getTransactionOffset(id); 
  console.log(offsetResponse);
  let offset = arweave.chunks.firstChunkOffset(offsetResponse);
  let totalSize = 0;
  while (offset < offsetResponse.offset) {
    const chunk = await arweave.chunks.getChunk(offset);
    const data = Arweave.utils.b64UrlToBuffer(chunk.chunk);
    console.log(`Read chunk of size: ${(data.byteLength / 1024).toFixed(2)}KiB`);
    offset += data.byteLength;
    totalSize += data.byteLength;
  }
  console.log(`Finished, read: ${totalSize}.`);
}

const id = process.argv.slice(-1)[0];

testIt(id)
  .catch(e => console.error(e))
