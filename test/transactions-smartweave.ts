import * as chai from "chai";
import { readFileSync } from 'fs';
import { arweaveInstance } from "./_arweave";

import wallet from "./fixtures/arweave-keyfile-fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw.json";

const expect = chai.expect;
const arweave = arweaveInstance();
const digestRegex = /^[a-z0-9-_]{43}$/i;

const contractPath = './test/fixtures/smartweave-contracts/token-pst.js';
const contractStatePath = './test/fixtures/smartweave-contracts/token-pst.json';
const contractTxId = 'ktzyKTMpH-HsLc8fuLcG2jzVO9V6mCFl4WC5lPWLRD8';

describe("SmartWeave Transactions", function() {
    it("the transaction for a contract creation by starting by the contract source should get signed and verified", async function () {
        const contractSrc = readFileSync(contractPath);
        const srcTx = await arweave.createTransaction({ data: contractSrc }, wallet);
        srcTx.addTag('App-Name', 'SmartWeaveContractSource');
        srcTx.addTag('App-Version', '0.3.0');
        srcTx.addTag('Content-Type', 'application/javascript');
        await arweave.transactions.sign(srcTx, wallet);

        expect(srcTx.signature).to.match(/^[a-z0-9-_]+$/i);

        expect(srcTx.id).to.match(digestRegex);

        const verified = await arweave.transactions.verify(srcTx);

        expect(verified).to.be.a("boolean");

        expect(verified).to.be.true;
    });

    it("the transaction for a contract creation by starting by a contract txId should get signed and verified", async function () {
        const contractState = readFileSync(contractStatePath);

        const txData = {
            data: contractState.toString(),
            target: '',
            quantity: '',
        };
        const contractTX = await arweave.createTransaction(txData, wallet);
        
        contractTX.addTag('App-Name', 'SmartWeaveContract');
        contractTX.addTag('App-Version', '0.3.0');
        contractTX.addTag('Contract-Src', contractTxId);
        contractTX.addTag('Content-Type', 'application/json');
        
        await arweave.transactions.sign(contractTX, wallet);
  
        expect(contractTX.signature).to.match(/^[a-z0-9-_]+$/i);

        expect(contractTX.id).to.match(digestRegex);

        const verified = await arweave.transactions.verify(contractTX);

        expect(verified).to.be.a("boolean");

        expect(verified).to.be.true;
    });
});
