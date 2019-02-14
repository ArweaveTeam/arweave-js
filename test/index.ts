import * as chai from "chai";
import { Api } from "../src/common/lib/api";
import { NodeCryptoDriver } from "../src/common/lib/crypto/node-driver";
import { Network } from "../src/common/network";
import { Silo } from "../src/common/silo";
import { Transactions } from "../src/common/transactions";
import { Wallets } from "../src/common/wallets";

import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();

describe("Initialization", function() {
  it("should have components", function() {
    expect(arweave.api).to.be.an.instanceOf(Api);

    expect(arweave.transactions).to.be.an.instanceOf(Transactions);

    expect(arweave.wallets).to.be.an.instanceOf(Wallets);

    expect(arweave.network).to.be.an.instanceOf(Network);

    expect(arweave.crypto).to.be.an.instanceOf(NodeCryptoDriver);

    expect(arweave.silo).to.be.an.instanceOf(Silo);
  });
});

describe("Network Info", function() {
  it("should get network info", async function() {
    this.timeout(5000);

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
