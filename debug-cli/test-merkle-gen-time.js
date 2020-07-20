#!/usr/bin/env node

const { chunkData, generateLeaves , buildLayers, generateProofs } = require('./node/lib/merkle');
const fs = require('fs');

async function testIt(file) {
  const data = fs.readFileSync(file);
  
  const t0 = Date.now()
  const chunks = await chunkData(data);
  const t1 = Date.now()
  const leaves = await generateLeaves(chunks);
  const t2 = Date.now()
  const root = await buildLayers(leaves);
  const t3 = Date.now()
  const proofs = await generateProofs(root);
  const t4 = Date.now()
  
  console.log(`Chunking: ${(t1-t0)/1000}`);
  console.log(`Leaves: ${(t2-t1)/1000}`);
  console.log(`Layers: ${(t3-t2)/1000}`);
  console.log(`Proofs: ${(t4-t3)/1000}`);
  console.log(process.memoryUsage());
  //console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

const file = process.argv.slice(-1)[0];

testIt(file)
  .then(x => console.log(x))
  .catch(e => console.error(e))
