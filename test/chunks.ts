import * as chai from "chai";
import { b64UrlToBuffer, bufferTob64Url } from "../src/common/lib/utils";
import {
  validatePath,
  generateTree,
  generateProofs,
  computeRootHash,
} from "../src/common/lib/merkle";
import { readFileSync } from "fs";
import { randomBytes } from "crypto";

const expect = chai.expect;

const rootB64Url = "t-GCOnjPWxdox950JsrFMu3nzOE4RktXpMcIlkqSUTw";
const root = b64UrlToBuffer(rootB64Url);
const pathB64Url =
  "7EAC9FsACQRwe4oIzu7Mza9KjgWKT4toYxDYGjWrCdp0QgsrYS6AueMJ_rM6ZEGslGqjUekzD3WSe7B5_fwipgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAnH6dASdQCigcL43lp0QclqBaSncF4TspuvxoFbn2L18EXpQrP1wkbwdIjSSWQQRt_F31yNvxtc09KkPFtzMKAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAIHiHU9QwOImFzjqSlfxkJJCtSbAox6TbbFhQvlEapSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAA";
const path = b64UrlToBuffer(pathB64Url);

const offset = 262143;
const dataSize = 836907;

describe("Chunks", function() {
  const data = readFileSync("./test/rebar3");

  it("should build a tree with a valid root", async function() {
    const rootNode = await generateTree(data);

    expect(bufferTob64Url(rootNode.id)).to.equal(rootB64Url);
    // const sortedProofs = await Promise.all(
    //   proofs.map(async (item) => {
    //     return {
    //       ...item,
    //       proof: item.proof,
    //       proofb64: bufferTob64Url(item.proof),
    //       debug: await debug(item.proof),
    //     };
    //   })
    // );
    // console.log("Root hash", bufferTob64Url(rootHash));
    // console.log(inspect(sortedProofs, false, null, true));
    // const toTest = sortedProofs[0];
  });

  it("should build valid proofs from tree", async function() {
    const rootNode = await generateTree(data);
    const proofs = await generateProofs(rootNode);
    expect(bufferTob64Url(proofs[0].proof)).to.equal(pathB64Url);
  });

  it("should validate own proofs and reject invalid verification parameters", async function() {
    const rootNode = await generateTree(data);
    const rootHash = await computeRootHash(data);
    const proofs = await generateProofs(rootNode);

    type Args = [Uint8Array, number, number, number, Uint8Array];

    const testInput: Args = [
      rootHash,
      proofs[0].offset,
      0,
      data.byteLength,
      proofs[0].proof,
    ];

    const didValidate = await validatePath.apply(validatePath, testInput);

    expect(didValidate).to.equal(true);

    const invalidInputA: Args = [
      rootHash,
      proofs[0].offset,
      0,
      data.byteLength,
      randomBytes(256), // invalid proof
    ];

    const didValidateWithInvalidInputA = await validatePath.apply(
      validatePath,
      invalidInputA
    );

    expect(didValidateWithInvalidInputA).to.equal(false);

    const invalidInputB: Args = [
      randomBytes(32), // invalid root node
      proofs[0].offset,
      0,
      data.byteLength,
      proofs[0].proof,
    ];

    const didValidateWithInvalidInputB = await validatePath.apply(
      validatePath,
      invalidInputB
    );

    expect(didValidateWithInvalidInputB).to.equal(false);
  });

  it("should validate a valid data path against a valid data root", async function() {
    expect(await validatePath(root, offset, 0, dataSize, path)).to.equal(true);
  });

  it("should reject invalid root", async function() {
    const invalidRoot = b64UrlToBuffer(
      "lX5K7gAUlIMt2hYYkoXVrjmVMnnjF6P6c5sov6mPqCm"
    );
    expect(await validatePath(invalidRoot, offset, 0, dataSize, path)).to.equal(
      false
    );
  });

  it("should reject invalid path", async function() {
    const invalidPath = b64UrlToBuffer(
      "VUSdubFW2cTvvr5s6VGSU2oxftxma77bRvils5fqikdj4qnP8xEG2HQQKyZeZGW5b9WNFlmDRBTyTJ8NnHQD3tLHc2VwctfdrXbkUODANATrOP6p8RNlSNT50jMKdSKymG0M8yv9g3LCoPB4QXawcRP6q9X5u1nnI7GFMlyuxoC4p21zWi7v68f1r73wXHWdH76VgCNbt0lEUDg1pW8sYvi6pdwAdTNdQIcAhqkO2JBJ2Kwtlxemj4E6NMKg9wi2pQHt6CKlX3T5rQdVd0Tt8czxrkOUBAW9J8XGK9iSLoj4LWZl3z4cKIFyZH7iUgIzCu9Id8jIoO93lVdgaUa4RW"
    );

    expect(await validatePath(root, offset, 0, dataSize, invalidPath)).to.equal(
      false
    );
  });
});
