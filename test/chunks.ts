import * as chai from "chai";
import { b64UrlToBuffer, bufferTob64Url } from "../src/common/lib/utils";
import {
  validatePath,
  generateTree,
  generateProofs,
  computeRootHash,
  chunkData,
  MAX_CHUNK_SIZE,
  MIN_CHUNK_SIZE,
  intToBuffer,
  bufferToInt,
} from "../src/common/lib/merkle";
import { readFileSync } from "fs";
import { randomBytes } from "crypto";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const rootB64Url = "t-GCOnjPWxdox950JsrFMu3nzOE4RktXpMcIlkqSUTw";
const root = b64UrlToBuffer(rootB64Url);
const pathB64Url =
  "7EAC9FsACQRwe4oIzu7Mza9KjgWKT4toYxDYGjWrCdp0QgsrYS6AueMJ_rM6ZEGslGqjUekzD3WSe7B5_fwipgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAnH6dASdQCigcL43lp0QclqBaSncF4TspuvxoFbn2L18EXpQrP1wkbwdIjSSWQQRt_F31yNvxtc09KkPFtzMKAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAIHiHU9QwOImFzjqSlfxkJJCtSbAox6TbbFhQvlEapSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAA";
const path = b64UrlToBuffer(pathB64Url);

const offset = 262143;
const dataSize = 836907;

describe("Chunks", function () {
  this.timeout(10000);

  const data = readFileSync("./test/rebar3");

  it("should validate all chunks from 1Mb.bin test file", async function () {
    // this.timeout(5000);
    const data = readFileSync("./test/fixtures/1mb.bin");

    const key = await arweaveInstance().wallets.generate();
    const tx = await arweaveInstance().createTransaction(
      { data: data, last_tx: "foo", reward: "1" },
      key
    );

    await tx.prepareChunks(tx.data);
    const tx_data_root = b64UrlToBuffer(tx.data_root);
    const results = await Promise.all(
      tx.chunks!.chunks.map((_, idx) => {
        const chunk = tx.getChunk(idx, data);
        return validatePath(
          tx_data_root,
          parseInt(chunk.offset),
          0,
          parseInt(chunk.data_size),
          b64UrlToBuffer(chunk.data_path)
        );
      })
    );
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).to.be.ok;
    }
  });

  it("should validate all chunks from lotsofdata.bin test file", async function () {
    // this.timeout(5000);
    const data = readFileSync("./test/fixtures/lotsofdata.bin");

    const key = await arweaveInstance().wallets.generate();
    const tx = await arweaveInstance().createTransaction(
      { data: data, last_tx: "foo", reward: "1" },
      key
    );

    await tx.prepareChunks(tx.data);
    const tx_data_root = b64UrlToBuffer(tx.data_root);
    const results = await Promise.all(
      tx.chunks!.chunks.map((_, idx) => {
        const chunk = tx.getChunk(idx, data);
        return validatePath(
          tx_data_root,
          parseInt(chunk.offset),
          0,
          parseInt(chunk.data_size),
          b64UrlToBuffer(chunk.data_path)
        );
      })
    );
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).to.ok;
    }
  });

  it("should convert ints to buffers and back up to Number.MAX_SAFE_INTEGER", async function () {
    this.timeout(20000);
    // we cant test every number :)
    for (let i = 0; i < 1024 * 1024; i++) {
      const buf = intToBuffer(i);
      const ret = bufferToInt(buf);
      expect(ret).to.equal(i);
    }
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i = i + 93444132157) {
      const buf = intToBuffer(i);
      const ret = bufferToInt(buf);
      expect(ret).to.equal(i);
    }
    expect(Number.MAX_SAFE_INTEGER).to.equal(
      bufferToInt(intToBuffer(Number.MAX_SAFE_INTEGER))
    );
  });

  it("should infer the end offset when validating a chunk proof", async function () {
    // this.timeout(5000);
    const key = await arweaveInstance().wallets.generate();
    const data = randomBytes(256 * 1024 * 3 - 128);
    const tx = await arweaveInstance().createTransaction(
      { data: data, last_tx: "foo", reward: "1" },
      key
    );
    await tx.prepareChunks(data);
    const tx_data_root = b64UrlToBuffer(tx.data_root);

    const chunk1 = await tx.getChunk(1, data);

    // save the correct offset
    const correctEndOffset = parseInt(chunk1.offset);
    // use a valid but different offset (this is the minimum valid offset, since the the chunk is 256*1024)
    const validatedChunk = await validatePath(
      tx_data_root,
      correctEndOffset - 256 * 1024 + 1,
      0,
      parseInt(chunk1.data_size),
      b64UrlToBuffer(chunk1.data_path)
    );

    if (validatedChunk) {
      expect(validatedChunk.offset).to.equal(correctEndOffset);
    }
    expect(validatedChunk).to.be.ok;
  });

  it("should fail to validate a chunk proof when the offset is not within the chunk", async function () {
    // this.timeout(5000);
    const key = await arweaveInstance().wallets.generate();
    const data = randomBytes(256 * 1024 + 256 * 50);
    const tx = await arweaveInstance().createTransaction(
      { data: data, last_tx: "foo", reward: "1" },
      key
    );
    await tx.prepareChunks(data);
    const tx_data_root = b64UrlToBuffer(tx.data_root);
    const chunk1 = await tx.getChunk(1, data);

    // offset '4' is in chunk0, not chunk1, so invalid.
    const validatedChunk = await validatePath(
      tx_data_root,
      4,
      0,
      parseInt(chunk1.data_size),
      b64UrlToBuffer(chunk1.data_path)
    );
    expect(validatedChunk).to.be.equal(false);
  });

  it("should infer the chunk size when validating a chunk proof", async function () {
    // this.timeout(5000);
    const key = await arweaveInstance().wallets.generate();
    const data = randomBytes(256 * 1024 * 2 - 128);
    const tx = await arweaveInstance().createTransaction(
      { data: data, last_tx: "foo", reward: "1" },
      key
    );
    await tx.prepareChunks(data);
    const tx_data_root = b64UrlToBuffer(tx.data_root);
    const chunk1 = await tx.getChunk(1, data);

    const correctEndOffset = parseInt(chunk1.offset);

    // Give it a wrong, but valid offset.

    const validatedChunk = await validatePath(
      tx_data_root,
      correctEndOffset - 10,
      0,
      parseInt(chunk1.data_size),
      b64UrlToBuffer(chunk1.data_path)
    );
    if (validatedChunk) {
      expect(validatedChunk.chunkSize).to.equal(
        b64UrlToBuffer(chunk1.chunk).byteLength
      );
    }
    expect(validatedChunk).to.be.ok;
  });

  it("should build a tree with a valid root", async function () {
    const rootNode = await generateTree(data);

    expect(bufferTob64Url(rootNode.id)).to.equal(rootB64Url);
  });

  it("should build valid proofs from tree", async function () {
    const rootNode = await generateTree(data);
    const proofs = await generateProofs(rootNode);
    expect(bufferTob64Url(proofs[0].proof)).to.equal(pathB64Url);
  });

  it("should validate own proofs and reject invalid verification parameters", async function () {
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

    expect(didValidate).to.ok;

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

  it("should validate a valid data path against a valid data root", async function () {
    expect(await validatePath(root, offset, 0, dataSize, path)).to.be.ok;
  });

  it("should reject invalid root", async function () {
    const invalidRoot = b64UrlToBuffer(
      "lX5K7gAUlIMt2hYYkoXVrjmVMnnjF6P6c5sov6mPqCm"
    );
    expect(await validatePath(invalidRoot, offset, 0, dataSize, path)).to.equal(
      false
    );
  });

  it("should reject invalid path", async function () {
    const invalidPath = b64UrlToBuffer(
      "VUSdubFW2cTvvr5s6VGSU2oxftxma77bRvils5fqikdj4qnP8xEG2HQQKyZeZGW5b9WNFlmDRBTyTJ8NnHQD3tLHc2VwctfdrXbkUODANATrOP6p8RNlSNT50jMKdSKymG0M8yv9g3LCoPB4QXawcRP6q9X5u1nnI7GFMlyuxoC4p21zWi7v68f1r73wXHWdH76VgCNbt0lEUDg1pW8sYvi6pdwAdTNdQIcAhqkO2JBJ2Kwtlxemj4E6NMKg9wi2pQHt6CKlX3T5rQdVd0Tt8czxrkOUBAW9J8XGK9iSLoj4LWZl3z4cKIFyZH7iUgIzCu9Id8jIoO93lVdgaUa4RW"
    );

    expect(await validatePath(root, offset, 0, dataSize, invalidPath)).to.equal(
      false
    );
  });

  it("should split multiples of MAX_CHUNK_SIZE with one extra zero-length chunk", async function () {
    const data = randomBytes(MAX_CHUNK_SIZE * 4);
    const chunks = await chunkData(data);
    expect(chunks.length).to.equal(5);
    chunks.forEach((chunk, idx) => {
      if (idx < 4) {
        expect(chunk.maxByteRange - chunk.minByteRange).to.equal(
          MAX_CHUNK_SIZE
        );
      } else {
        expect(chunk.maxByteRange - chunk.minByteRange).to.equal(0);
      }
    });
  });

  it("should adjust the last two chunks to avoid chunks under MIN_CHUNK_SIZE", async function () {
    const data = randomBytes(MAX_CHUNK_SIZE + MIN_CHUNK_SIZE - 1);
    const chunks = await chunkData(data);
    expect(chunks.length).to.equal(2);
    const chunk0size = chunks[0].maxByteRange - chunks[0].minByteRange;
    const chunk1size = chunks[1].maxByteRange - chunks[1].minByteRange;
    expect(chunk0size).to.be.gt(MIN_CHUNK_SIZE);
    expect(chunk1size).to.be.gte(MIN_CHUNK_SIZE);
    expect(chunk0size).to.be.equal(chunk1size + 1);
  });
});
