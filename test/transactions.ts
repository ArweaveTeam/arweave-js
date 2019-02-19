import * as chai from "chai";
import * as crypto from "crypto";
import { Transaction } from "../src/common/lib/transaction";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();

const digestRegex = /^[a-z0-9-_]{43}$/i;
const liveDataTxid = "bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U";

describe("Transactions", function() {
  it("should create and sign data transactions", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      { data: "test" },
      wallet
    );

    transaction.addTag("test-tag-1", "test-value-1");
    transaction.addTag("test-tag-2", "test-value-2");
    transaction.addTag("test-tag-3", "test-value-3");

    expect(transaction).to.be.an.instanceOf(Transaction);

    expect(transaction.data).to.equal("dGVzdA");

    expect(transaction.last_tx).to.equal("");

    expect(transaction.reward).to.match(/^[0-9]+$/);

    await arweave.transactions.sign(transaction, wallet);

    expect(transaction.signature).to.match(/^[a-z0-9-_]+$/i);

    expect(transaction.id).to.match(digestRegex);

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean");

    expect(verified).to.be.true;

    //@ts-ignore
    // Needs ts-ignoring as tags are readonly so chaning the tag like this isn't
    // normally an allowed operation, but it's a test, so...
    transaction.tags[1].value = "dGVzdDI";

    const verifiedWithModififedTags = await arweave.transactions.verify(
      transaction
    );

    expect(verifiedWithModififedTags).to.be.a("boolean");

    expect(verifiedWithModififedTags).to.be.false;
  });

  it("should create and sign ar transactions", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      {
        target: "GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk",
        quantity: arweave.ar.arToWinston("1.5")
      },
      wallet
    );

    expect(transaction).to.be.an.instanceOf(Transaction);

    expect(transaction.quantity)
      .to.be.a("string")
      .and.equal("1500000000000");

    expect(transaction.target)
      .to.be.a("string")
      .and.equal("GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk");
  });

  it("should work with buffers", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    let data = crypto.randomBytes(100);

    const transaction = await arweave.createTransaction({ data: data }, wallet);

    transaction.addTag("test-tag-1", "test-value-1");
    transaction.addTag("test-tag-2", "test-value-2");
    transaction.addTag("test-tag-3", "test-value-3");

    expect(transaction).to.be.an.instanceOf(Transaction);

    expect(
      Buffer.from(transaction.get("data", { decode: true, string: false }))
    ).to.deep.equal(data);

    expect(transaction.last_tx).to.equal("");

    expect(transaction.reward).to.match(/^[0-9]+$/);

    await arweave.transactions.sign(transaction, wallet);

    expect(transaction.signature).to.match(/^[a-z0-9-_]+$/i);

    expect(transaction.id).to.match(digestRegex);

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean");

    expect(verified).to.be.true;

    //@ts-ignore
    // Needs ts-ignoring as tags are readonly so chaning the tag like this isn't
    // normally an allowed operation, but it's a test, so...
    transaction.tags[1].value = "dGVzdDI";

    const verifiedWithModififedTags = await arweave.transactions.verify(
      transaction
    );

    expect(verifiedWithModififedTags).to.be.a("boolean");

    expect(verifiedWithModififedTags).to.be.false;
  });

  it("should get transaction info", async function() {
    this.timeout(5000);

    const transactionStatus = await arweave.transactions.getStatus(
      liveDataTxid
    );
    const transaction = await arweave.transactions.get(liveDataTxid);

    expect(transactionStatus).to.be.a("object");

    expect(Object.keys(transactionStatus.confirmed)).to.contain.members([
      "block_indep_hash",
      "block_height",
      "number_of_confirmations"
    ]);

    expect(transactionStatus.confirmed.block_indep_hash).to.be.a("string");
    expect(transactionStatus.confirmed.block_height).to.be.a("number");
    expect(transactionStatus.confirmed.number_of_confirmations).to.be.a(
      "number"
    );

    expect(transaction.get("data", { decode: true, string: true })).to.contain(
      "<title>ARWEAVE / PEER EXPLORER</title>"
    );

    expect(await arweave.transactions.verify(transaction)).to.be.true;

    transaction.signature = "xxx";

    const verifyResult = await (() => {
      return new Promise(resolve => {
        arweave.transactions.verify(transaction).catch(error => {
          resolve(error);
        });
      });
    })();

    expect(verifyResult)
      .to.be.an.instanceOf(Error)
      .with.property("message")
      .and.match(/^.*invalid transaction signature.*$/i);
  });

  it("should post transactions", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      { data: "test" },
      wallet
    );

    const unsignedResponse = await arweave.transactions.post(transaction);

    expect(unsignedResponse.status).to.be.a("number");

    // Unsigned transactions shouldn't be accepted (current implementation returns 500)
    expect(unsignedResponse.status).to.equal(500);

    await arweave.transactions.sign(transaction, wallet);

    const signedResponse = await arweave.transactions.post(transaction);

    expect(signedResponse.status).to.be.a("number");

    expect(signedResponse.status).to.not.equal(500);
  });

  it("should find transactions", async function() {
    const results = await arweave.transactions.search(
      "Silo-Name",
      "BmjRGIsemI77+eQb4zX8"
    );

    expect(results)
      .to.be.an("array")
      .which.contains("Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE");
  });
});
