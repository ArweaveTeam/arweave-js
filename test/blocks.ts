import * as chai from "chai";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();

describe("Blocks", function () {
  this.timeout(50000);

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
    const expectedResult = require(`./fixtures/block_${blockIndepHash}.json`);

    // when
    const result = (await arweave.blocks.get(blockIndepHash)) as any; // note: any to be able to access object values by keys.

    // then
    expect(expectedResult).to.deep.equal(result);
  });

  it("should get block's data by its height", async function () {
    // given
    // https://arweave.net/block/height/1000000
    const blockHeight = 1000000;
    const expectedResult = require(`./fixtures/block_height_${blockHeight}.json`);

    // when
    const result = (await arweave.blocks.getByHeight(blockHeight)) as any; // note: any to be able to access object values by keys.

    // then
    expect(expectedResult).to.deep.equal(result);
  });
});
