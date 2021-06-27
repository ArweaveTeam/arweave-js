import * as chai from "chai";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();

describe("Blocks", function () {
  beforeEach(() => {
    this.timeout(10000);
  });

  const blockTypeFields: string[] = [
    "nonce",
    "previous_block",
    "timestamp",
    "last_retarget",
    "diff",
    "height",
    "hash",
    "indep_hash",
    "txs",
    "tx_root",
    "wallet_list",
    "reward_addr",
    "tags",
    "reward_pool",
    "weave_size",
    "block_size",
    "cumulative_diff",
    "hash_list_merkle",
  ];

  it("should get block's data by its indep_hash", async function () {
    // given
    // https://arweave.net/block/hash/zbUPQFA4ybnd8h99KI9Iqh4mogXJibr0syEwuJPrFHhOhld7XBMOUDeXfsIGvYDp
    const blockIndepHash =
      "zbUPQFA4ybnd8h99KI9Iqh4mogXJibr0syEwuJPrFHhOhld7XBMOUDeXfsIGvYDp";
    const expectedResult = require("./fixtures/block_zbUPQFA4ybnd8h99KI9Iqh4mogXJibr0syEwuJPrFHhOhld7XBMOUDeXfsIGvYDp.json");

    // when
    const result = (await arweave.blocks.get(blockIndepHash)) as any; // note: any to be able to access object values by keys.

    // then
    blockTypeFields.forEach((field) => {
      expect(result[field]).to.be.deep.equal(expectedResult[field]);
    });
  });

  it("should get current block's data", async function () {
    // given
    const { current } = await arweave.network.getInfo();

    // when
    const result = await arweave.blocks.getCurrent();

    // then
    expect(result.indep_hash).to.be.equal(current);
  });
});
