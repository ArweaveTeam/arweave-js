import { expect } from "chai";
import {} from "mocha";
import { arweaveInstance } from "./_arweave";
const arweave = arweaveInstance();

const idBinary = "zvpvIoP7TDkf9S3SW6MsxoIvZAMonwAFO_ISSAxBm1A"; //a jpeg image
const idText = "Lv_IaSYGMma5vvD3jmkwl51ELchQ75rNfukltJw3Hh8"; //html page, utf-8
const idJson = "t4B9Dufi14vTWl7nS9eiFfxojeNvmNzBwoUZ0IQMar8"; //json file

describe("API", function () {
  this.timeout(10_000);

  it("should GET json requests", async function () {
    const res = await arweave.api.get(idJson);
    expect(res.ok).true;
    expect(res.bodyUsed).true;
    expect(res.headers.get("content-type")).eq(
      "application/json; charset=utf-8"
    );
    expect(res.headers.get("content-type")).eq(
      "application/json; charset=utf-8"
    );
    expect(typeof res.data).eq("object");
    expect(res.data).not.instanceof(ArrayBuffer);
  });
  it('should GET binary requests, using "axios" responseType', async function () {
    const res = await arweave.api.get(idBinary, {
      responseType: "arraybuffer",
    });
    expect(res.ok, `!res.ok status: ${res.status}`).true;
    expect(res.bodyUsed, `!res.bodyUsed status: ${res.status}`).true;
    expect(res.headers.get("content-type")).eq("image/jpeg");
    expect(typeof res.data).eq("object");
    expect(res.data).instanceof(ArrayBuffer);
  });
  it("should GET text requests", async function () {
    const res = await arweave.api.get(idText);
    expect(res.ok).true;
    expect(res.bodyUsed).true;
    expect(res.headers.get("content-type")).eq("text/html; charset=utf-8");
    expect(typeof res.data).eq("string");
  });

  it("should POST GQL queries return a list of results", async function () {
    const txs = (
      await arweave.api.post("/graphql", {
        query: `
      {
        transactions(
          tags: [
            { name: "App-Name", values: ["CommunityXYZ"] }
          ]
        ) {
          edges {
            node {
              id
            }
          }
        }
      }`,
      })
    ).data.data.transactions.edges;

    expect(txs).to.be.an("array");
    expect(txs.length).to.be.greaterThan(0);
  });
});
