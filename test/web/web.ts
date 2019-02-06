import * as chai from "chai";
import * as crypto from "crypto";
import { ArweaveUtils } from "../../web/arweave/lib/utils";
import { Transaction } from "../../web/arweave/lib/transaction";

const expect = chai.expect;

let globals = <any>global;

// globals.window = { Arweave: {} };

//@ts-ignore
const arweave = window.Arweave.init({ host: "arweave.net", logging: false });

//@ts-ignore
window.arweave = arweave;

const digestRegex = /^[a-z0-9-_]{43}$/i;
const liveAddressBalance = "498557055636";
const liveAddress = "9_666Wkk2GzL0LGd3xhb0jY7HqNy71BaV4sULQlJsBQ";
const liveTxid = "CE-1SFiXqWUEu0aSTebE6LC0-5JBAc3IAehYGwdF5iI";

const liveDataTxid = "Ie-fxxzdBweiA0N1ZbzUqXhNI310uDUmaBc3ajlV6YY";

describe("Initialization", function() {
  it("should have components", function() {
    expect(arweave.api).to.an("object");

    expect(arweave.transactions).to.an("object");

    expect(arweave.wallets).to.an("object");

    expect(arweave.network).to.an("object");

    expect(arweave.crypto).to.an("object");

    expect(arweave.silo).to.an("object");
  });
});

describe("Network Info", function() {
  it("should get network info", async function() {
    this.timeout(3000);

    const info = await arweave.network.getInfo();
    const peers = await arweave.network.getPeers();

    expect(info).to.be.an("object");

    expect(Object.keys(info)).to.contain.members([
      "height",
      "current",
      "release",
      "version",
      "blocks"
    ]);

    expect(info.height)
      .to.be.a("number")
      .greaterThan(0);

    expect(peers).to.be.an("array");
  });
});

describe("Wallets and keys", function() {
  it("should generate valid JWKs", async function() {
    this.timeout(15000);

    const walletA = await arweave.wallets.generate();
    const walletB = await arweave.wallets.generate();

    expect(walletA).to.be.an("object", "New wallet is not an object");

    expect(walletA).to.have.all.keys(
      "kty",
      "n",
      "e",
      "d",
      "p",
      "q",
      "dp",
      "dq",
      "qi"
    );

    expect(walletA.kty).to.equal("RSA");

    expect(walletA.e).to.equal("AQAB");

    expect(walletA.n).to.match(/^[a-z0-9-_]{683}$/i);

    expect(walletA.d).to.match(/^[a-z0-9-_]{683}$/i);

    const addressA = await arweave.wallets.jwkToAddress(walletA);
    const addressB = await arweave.wallets.jwkToAddress(walletB);

    expect(addressA).to.be.a("string");

    expect(addressA).to.match(digestRegex);

    expect(addressB).to.match(digestRegex);

    expect(addressA).to.not.equal(addressB);
  });

  it("should get wallet info", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    const address = await arweave.wallets.jwkToAddress(wallet);

    const balance = await arweave.wallets.getBalance(address);

    const lastTx = await arweave.wallets.getLastTransactionID(address);

    expect(balance).to.be.a("string");

    expect(balance).to.equal("0");

    expect(lastTx).to.be.a("string");

    expect(lastTx).to.equal("");

    const balanceB = await arweave.wallets.getBalance(liveAddress);

    const lastTxB = await arweave.wallets.getLastTransactionID(liveAddress);

    expect(balanceB).to.be.a("string");

    expect(balanceB).to.equal(liveAddressBalance);

    expect(lastTxB).to.be.a("string");

    expect(lastTxB).to.equal(liveTxid);
  });
});

describe("Transactions", function() {
  it("should create and sign transactions", async function() {
    this.timeout(5000);

    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createTransaction(
      { data: "test" },
      wallet
    );

    transaction.addTag("test-tag-1", "test-value-1");
    transaction.addTag("test-tag-2", "test-value-2");
    transaction.addTag("test-tag-3", "test-value-3");

    expect(transaction).to.be.an("object");

    expect(transaction.data).to.equal("dGVzdA");

    expect(transaction.last_tx).to.equal("");

    expect(transaction.reward).to.match(/^[0-9]+$/);

    await arweave.transactions.sign(transaction, wallet);

    expect(Object.keys(transaction)).to.contain.members([
      "id",
      "data",
      "tags",
      "signature",
      "reward",
      "owner",
      "last_tx"
    ]);

    expect(transaction.signature).to.match(/^[a-z0-9-_]+$/i);

    expect(transaction.id).to.match(digestRegex);

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean").and.to.be.true;

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

    expect(transactionStatus).to.be.a("number");

    expect(transactionStatus).to.equal(200);

    expect(transaction.get("data", { decode: true, string: true })).to.contain(
      "<title>Releases · ArweaveTeam/arweave</title>"
    );

    expect(await arweave.transactions.verify(transaction)).to.be.true;

    transaction.signature = "xxx";

    const verifyResult = await (() => {
      return new Promise(resolve => {
        arweave.transactions.verify(transaction).catch((error: any) => {
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
    this.timeout(5000);

    const results = await arweave.transactions.search(
      "Silo-Name",
      "BmjRGIsemI77+eQb4zX8"
    );

    expect(results)
      .to.be.an("array")
      .which.contains("Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE");
  });
});

describe("Encryption", function() {
  it("should encrypt and decrypt using key round trip", async function() {
    this.timeout(5000);

    const text = "some data to encrypt";

    const data = ArweaveUtils.stringToBuffer(text);

    const key = crypto.randomBytes(32);

    const encrypted = await arweave.crypto.encrypt(data, key);

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key);

    expect(ArweaveUtils.bufferToString(decrypted)).to.equal(text);
  });

  it("should encrypt and decrypt using passphrase round trip", async function() {
    this.timeout(5000);

    const text = "some data to encrypt";

    const data = ArweaveUtils.stringToBuffer(text);

    const key = "super-secret-password";

    const encrypted = await arweave.crypto.encrypt(data, key);

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key);

    expect(ArweaveUtils.bufferToString(decrypted)).to.equal(text);
  });
});

describe("Silo Web", function() {
  it("should read Silo transaction", async function() {
    this.timeout(5000);

    // This is a manually generated silo transaction
    // data = 'something'
    // uri = 'secret.1'
    const transaction = arweave.transactions.fromRaw({
      last_tx: "Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE",
      owner:
        "pJjRtSRLpHUVAKCtWC9pjajI_VEpiPEEAHX0k1B1jrB_jDlZsMJPyGRVX6n7N16vNyDTnKAofC_aNmTFegW-uyJmdxsteO1TXKrR_KJvuv_vACX4N8BkSgplB7mTTALBMNPmiINHXkDSxZEkBxAGV0GyL8pLd2-0X6TG16wDFShyS7rZzW8xFsQYiAp9-g330hPhCV7KBdVFtCxA0h1RifDYloMUwHbAWCTvzm72aLI1nWaLzotcM4cZTTdzw5VTdGtjo9fMdoT7uTqikIIhM3C4f9Ws-ECqjBUXtZFg7q6jYbUcTVNr1o2UFPKbLnDl4vcUZBaeqkL0FWQuo7F1hw36PVm_b9lVVzSVVkeA_HF2tQotkaITyOQmYfTHi1d31m5fwFZje_M-YgeyvOIuiqX4-lIGz8pohTutY3Z5_LKfO_a8jsJL8_jFLqcjSCRvVZSRmQDpzB4hJ9-W89m95DDmZci2wLbxFR8GwekNbpHeeC2EaJorhU0qBn_Hlcxql30fLveycjhSO03bu3MJwN9moT2q0T222iIXutEjpNezt5VzZKao8_JuI3ZnTFy5dM5GYO773TbgUihlVjVQsnv73FFPZaHfaRssK4sfGlBHjItwkzEQe9gOtFhkAFihiw45ppo6FnBkvmNcD59GfteifKPg5oSGYqMWZWcKPt0",
      tags: [
        { name: "Q29udGVudC1UeXBl", value: "dGV4dC9odG1s" },
        { name: "VXNlci1BZ2VudA", value: "QXJ3ZWF2ZURlcGxveS8xLjAuMA" },
        { name: "U2lsby1WZXJzaW9u", value: "MC4xLjA" }
      ],
      target: "",
      quantity: "0",
      data:
        "0HgHqou5BTRNYJIsCciZb2-85Qlg9cYpiHO62KbRCEeX_cjSvn--Cex8uksInemd6FWWkczaqjs3SWzr7BRc0BSjHXxlVHkKuQp7WvRRJeNJPk_nC0KZrjkFSIPLIx_oOSeXigaPSEBSC4ry_5Iygt7z0Dgl7z1eFplIs6MlxKuBwiXfCtlwRDQK_fJlPWZhGjOpNLP5dyOLwMKrvG2dbAOeyAYbr117rn19CiDkTQAI3m2gAcJlXDZTNeA-1rJqb6X73u0AQt4Ao-OkktxdZ1UMfMfXnwdlsAEKK14NiKRbL1UbVRGh1nyWjUl90BP5Qj74L6_CKxQc_us7gxdeUhkzIKr4-LMY4LoCr-l0Law_tIGekkRsqb5oN7JiketqWazgsyo-Gq-0Blvhwh8nww",
      reward: "349612332",
      signature:
        "DJ6V8zXFMvkyNS4nNHxdFgXx1cbMuzQfWdtP_navPG1STMUarYKHWnJvFQqNkFl5CekNql0xTOjY5hWLt2AVxfMWgvvi5498vNUpbFoWxjrVl6fk86ARx2lzYB7iQK4YFIuIQ7MdR0w8Dy836hW7c8gXe_FPRAqOI7J_l8fqUSzaUtlcwLSfvhXJM-2a3WmoGLcg8Gvj53B8-RizvM3BrKQQWrcat78zeOgb-Fzl3PQ_Ej3CiRIDgAYnTxmd7M6jI84uck1gBRjMql42n0F8pQuTgMqzDbeXW2iBuvIE5tYVmUgnNrPjkDedLWe0Hp4KLDQyDY9lO-zIJLpiYCbc7kUfDBontxCCJIy9N8XM9gHqQofCItYAEO4v3B7sXgdSAQzcibnM3j6EhB9-mhiDcKKRuTSvyJh3sBTWHFrnWylfq84JOJLNhR4aZA_UfjkccA7Z-yqoiMI0mOB0HaAEmsa6ZsoLs5C-6vDnGaBCqYeVKKqKizfOQGsc9IuzdsSQwY7yTE-C3Xb3eAgnq0BLn6iUNqFU-mkwHi-c_hpxoR0lY91k98Ra9UhrgFS5m_9x3BhCXNhDaUXb16p0fHKGYSggqgqS3FbEcdOnsQlhw3IFEccFOTvuv1xEoE1zYeZ06q6NkFKMik6soXl9LXXgJgZvpEut_2LaHKtojbWqSkc",
      id: "S-9ICDleH3PEx9LXVEbguVffe5dHEM0I3wEr_MJidqU"
    });

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean").and.to.be.true;

    const decrypted = await arweave.silo.readTransactionData(
      transaction,
      "thing.1"
    );

    expect(ArweaveUtils.bufferToString(decrypted))
      .to.be.a("string")
      .and.contain("<title>Hello world!</title>");
  });

  it("should pass a Silo transaction roundtrip", async function() {
    this.timeout(10000);

    const wallet = await arweave.wallets.generate();

    const transaction = await arweave.createSiloTransaction(
      { data: "test data" },
      wallet,
      "my-silo-ref.1"
    );

    await arweave.transactions.sign(transaction, wallet);

    const verified = await arweave.transactions.verify(transaction);

    expect(verified).to.be.a("boolean").and.to.be.true;

    let decrypted = await arweave.silo.readTransactionData(
      transaction,
      "my-silo-ref.1"
    );

    expect(ArweaveUtils.bufferToString(decrypted))
      .to.be.a("string")
      .and.equal("test data");
  });
});
