import * as chai from "chai";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();

const digestRegex = /^[a-z0-9-_]{43}$/i;
const liveAddressBalance = "498557055636";
const liveAddress = "9_666Wkk2GzL0LGd3xhb0jY7HqNy71BaV4sULQlJsBQ";
const liveTxid = "CE-1SFiXqWUEu0aSTebE6LC0-5JBAc3IAehYGwdF5iI";

describe("Wallets and keys", function () {
  this.timeout(20000);
  it("should generate valid JWKs", async function () {
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

    /** extra tests that private matches public */
    const sigA = await arweave.crypto.sign(
      walletA,
      new Uint8Array([1, 2, 3, 4])
    );
    const verifyA = await arweave.crypto.verify(
      walletA.n,
      new Uint8Array([1, 2, 3, 4]),
      sigA
    );
    expect(verifyA).true;
    const sigB = await arweave.crypto.sign(
      walletB,
      new Uint8Array([1, 2, 3, 4])
    );
    const verifyB = await arweave.crypto.verify(
      walletB.n,
      new Uint8Array([1, 2, 3, 4]),
      sigB
    );
    expect(verifyB).true;

    const addressA = await arweave.wallets.jwkToAddress(walletA);
    const addressB = await arweave.wallets.jwkToAddress(walletB);

    expect(addressA).to.be.a("string");
    expect(addressA).to.match(digestRegex);
    expect(addressB).to.match(digestRegex);
    expect(addressA).to.not.equal(addressB);

    expect(arweave.utils.b64UrlToBuffer(walletA.n).byteLength).eq(4096 / 8)
    expect(arweave.utils.b64UrlToBuffer(walletB.n).byteLength).eq(4096 / 8)
  });

  it("should get wallet info", async function () {
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

  it("Should resolve JWK to address", async function () {
    const jwk = require("./fixtures/arweave-keyfile-fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw.json");

    const address = await arweave.wallets.jwkToAddress(jwk);

    expect(address)
      .to.be.a("string")
      .and.equal("fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw");
  });

  it("Should resolve public key to address", async function () {
    const jwk = require("./fixtures/arweave-keyfile-fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw.json");

    const address = await arweave.wallets.ownerToAddress(jwk.n);

    expect(address)
      .to.be.a("string")
      .and.equal("fOVzBRTBnyt4VrUUYadBH8yras_-jhgpmNgg-5b3vEw");
  });
});
