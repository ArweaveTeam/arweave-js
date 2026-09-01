import { expect } from "chai";
import "mocha";
import { arweaveInstance } from "./_arweave";

const arweave = arweaveInstance();

const siloTxId = "Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE";
const siloAccessKey = "BmjRGIsemI77+eQb4zX8";
const otherSiloAccessKey = "I5/Hxg5a0DVZBlxtLrTq";
const otherSiloTxId = "TlwKj-xyQ3vhbi0HU7HTWHfgHamDuntDFt7qR57_yqw";

describe("ArQL", function () {
  this.timeout(30_000);

  it("should resolve an equals expression on a tag", async function () {
    const results = await arweave.arql({
      op: "equals",
      expr1: "Silo-Name",
      expr2: siloAccessKey,
    });

    expect(results).to.be.an("array").which.contains(siloTxId);
  });

  it("should resolve an equals expression on the 'from' pseudo tag", async function () {
    const results = await arweave.arql({
      op: "equals",
      expr1: "from",
      expr2: "hnRI7JoN2vpv__w90o4MC_ybE9fse6SUemwQeY8hFxM",
    });

    expect(results).to.be.an("array").with.lengthOf(0);
  });

  it("should narrow results with 'and'", async function () {
    const results = await arweave.arql({
      op: "and",
      expr1: { op: "equals", expr1: "Silo-Name", expr2: siloAccessKey },
      expr2: { op: "equals", expr1: "Content-Type", expr2: "text/html" },
    });

    expect(results).to.be.an("array").which.contains(siloTxId);
  });

  it("should return no results for an unsatisfiable 'and'", async function () {
    const results = await arweave.arql({
      op: "and",
      expr1: { op: "equals", expr1: "Silo-Name", expr2: siloAccessKey },
      expr2: { op: "equals", expr1: "Silo-Name", expr2: otherSiloAccessKey },
    });

    expect(results).to.be.an("array").with.lengthOf(0);
  });

  it("should union results with 'or'", async function () {
    const results = await arweave.arql({
      op: "or",
      expr1: { op: "equals", expr1: "Silo-Name", expr2: siloAccessKey },
      expr2: { op: "equals", expr1: "Silo-Name", expr2: otherSiloAccessKey },
    });

    expect(results).to.be.an("array");
    expect(results).to.contain(siloTxId);
    expect(results).to.contain(otherSiloTxId);
    expect(results.length).to.equal(new Set(results).size);
  });

  it("should throw on an unsupported op", async function () {
    try {
      await arweave.arql({ op: "not", expr1: "a", expr2: "b" });
      expect.fail("should have thrown");
    } catch (error: any) {
      expect(error.message).to.match(/unsupported op/i);
    }
  });

  it("should throw on a malformed query", async function () {
    for (const query of [null, "nope", 42, {}, { op: "equals", expr1: 1 }]) {
      try {
        await arweave.arql(query as any);
        expect.fail(`should have thrown for ${JSON.stringify(query)}`);
      } catch (error: any) {
        expect(error.message).to.match(/invalid arql query/i);
      }
    }
  });
});
