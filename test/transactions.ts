import * as chai from "chai";
import * as crypto from "crypto";
import Transaction from "../src/common/lib/transaction";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();
// const arweaveDirectNode = arweaveInstanceDirectNode();

const digestRegex = /^[a-z0-9-_]{43}$/i;
const liveDataTxid = "bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U";

// These are all identical data (test.mp4)
// const liveDataTxidLarge = "8S0uH6EtRkJOG0b0Q2XsEBSZmbMLnxAwIlNAe_P7ZHg";
// const liveDataTxidLarge = "P4l6aCN97rt4GoyrpG1oKq3A20B2Y24GqmMLWNZlNIk"
const liveDataTxidLarge = "KDKSOaecDl_IM4E0_0XiApwdrElvb9TnwOzeHt65Sno";

describe("Transactions", function () {
  this.timeout(30000);

  it("should create and sign data transactions", async function () {
    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      { data: "test" },
      wallet
    );

    transaction.addTag("test-tag-1", "test-value-1");
    transaction.addTag("test-tag-2", "test-value-2");
    transaction.addTag("test-tag-3", "test-value-3");

    expect(transaction).to.be.an.instanceOf(Transaction);

    expect(transaction.get("data")).to.equal("dGVzdA");

    expect(transaction.last_tx).to.match(/^[a-z0-9-_]{64}$/i);

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

  it("should use JWK.n as transaction owner", async function () {
    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      {
        data: "test",
      },
      wallet
    );

    expect(transaction.get("owner")).to.equal(wallet.n);
  });

  it("should use the provided transaction owner attribute", async function () {
    const transaction = await arweave.createTransaction({
      data: "test",
      owner: "owner-test-abc",
    });

    expect(transaction.get("owner")).to.equal("owner-test-abc");
  });

  it("should create and sign valid transactions when no owner or JWK provided", async function () {
    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction({
      data: "test",
    });

    await arweave.transactions.sign(transaction, wallet);

    expect(transaction.get("owner")).to.equal(wallet.n);

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean");
    expect(verified).to.be.true;
  });

  it("should create and sign ar transactions", async function () {
    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      {
        target: "GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk",
        quantity: arweave.ar.arToWinston("1.5"),
      },
      wallet
    );

    expect(transaction).to.be.an.instanceOf(Transaction);

    expect(transaction.quantity).to.be.a("string").and.equal("1500000000000");

    expect(transaction.target)
      .to.be.a("string")
      .and.equal("GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk");
  });

  it("should work with buffers", async function () {
    // this.timeout(10000);

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

    expect(transaction.last_tx).to.match(/^[a-z0-9-_]{64}$/i);

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

  it("should get transaction info", async function () {
    const transactionStatus = await arweave.transactions.getStatus(
      liveDataTxid
    );
    const transaction = await arweave.transactions.get(
      "erO78Ram7nOEYKdSMfsSho1QWC_iko407AryZdJ2Z3k"
    );

    expect(transactionStatus).to.be.a("object");
    expect(transactionStatus.confirmed).to.be.a("object");

    expect(Object.keys(transactionStatus.confirmed!)).to.contain.members([
      "block_indep_hash",
      "block_height",
      "number_of_confirmations",
    ]);

    expect(transactionStatus.confirmed!.block_indep_hash).to.be.a("string");
    expect(transactionStatus.confirmed!.block_height).to.be.a("number");
    expect(transactionStatus.confirmed!.number_of_confirmations).to.be.a(
      "number"
    );

    expect(await arweave.transactions.verify(transaction)).to.be.true;

    transaction.signature = "xxx";

    const verifyResult = await (() => {
      return new Promise((resolve) => {
        arweave.transactions.verify(transaction).catch((error) => {
          resolve(error);
        });
      });
    })();

    expect(verifyResult)
      .to.be.an.instanceOf(Error)
      .with.property("message")
      .and.match(/^.*invalid transaction signature.*$/i);
  });

  it("should get transaction data", async function () {
    const txRawData = await arweave.transactions.getData(liveDataTxid);
    expect(txRawData)
      .to.be.a("string")
      .which.contain("CjwhRE9DVFlQRSBodG1sPgo");

    const txDecodeData = await arweave.transactions.getData(liveDataTxid, {
      decode: true,
    });
    expect(txDecodeData).to.be.a("Uint8Array").to.contain([10, 60, 33, 68]);

    const txDecodeStringData = await arweave.transactions.getData(
      liveDataTxid,
      { decode: true, string: true }
    );
    expect(txDecodeStringData)
      .to.be.a("string")
      .which.contain("<title>ARWEAVE / PEER EXPLORER</title>");
  });

  it("should get transaction data > 12MiB from chunks or gateway", async function () {
    this.timeout(300_000);
    const data = (await arweave.transactions.getData(liveDataTxidLarge, {
      decode: true,
    })) as Uint8Array;
    expect(data.byteLength).to.equal(14166765);
  });

  // it("should get transaction data > 12MiB from a node", async function () {
  //   this.timeout(150000);
  //   const data = (await arweaveDirectNode.transactions.getData(
  //     liveDataTxidLarge,
  //     { decode: true }
  //   )) as Uint8Array;
  //   expect(data.byteLength).to.equal(14166765);
  // });

  it("should find transactions", async function () {
    const results = await arweave.transactions.search(
      "Silo-Name",
      "BmjRGIsemI77+eQb4zX8"
    );

    expect(results)
      .to.be.an("array")
      .which.contains("Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE");
  });

  it("should support format=2 transaction signing", async function () {
    const jwk = require("./fixtures/arweave-keyfile-fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw.json");
    const unsignedV2TxFixture = require("./fixtures/unsigned_v2_tx.json");
    const signedV2TxFixture = require("./fixtures/signed_v2_tx.json");

    const data = arweave.utils.b64UrlToBuffer(unsignedV2TxFixture.data);
    const expectedSignature = signedV2TxFixture.signature;
    const expectedDataRoot = signedV2TxFixture.data_root;

    const tx = await arweave.createTransaction(
      {
        format: 2,
        last_tx: "",
        data,
        reward: arweave.ar.arToWinston("100"),
      },
      jwk
    );

    // Pass an explicit saltLength = 0 to get a deterministic signature
    // that matches the test fixture
    await arweave.transactions.sign(tx, jwk, { saltLength: 0 });

    let dataRoot = arweave.utils.bufferTob64Url(
      tx.get("data_root", { decode: true, string: false })
    );
    expect(dataRoot).to.equal(expectedDataRoot);
    expect(tx.signature).to.equal(expectedSignature);
  });
});
