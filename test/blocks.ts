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

  it("should get current block's data", async function () {
    // given
    const { current } = await arweave.network.getInfo();

    // when
    const result = await arweave.blocks.getCurrent();

    // then (account for fast mining rate and forgive it being in previous_block)
    expect(current).to.be.oneOf([result.previous_block, result.indep_hash]);
  });
});
