import * as chai from "chai";
import * as utils from "../../../src/common/lib/utils";

const expect = chai.expect;

const nonStrings = [
  false,
  undefined,
  null,
  true,
  {},
  { test: "hello" },
  [],
  ["1"],
];

// Expected values generated with node's Buffer, independent of the implementation under test.
const vectors = [
  { bytes: [], b64: "", b64Url: "" },
  { bytes: [0], b64: "AA==", b64Url: "AA" },
  { bytes: [0, 7], b64: "AAc=", b64Url: "AAc" },
  { bytes: [0, 7, 14], b64: "AAcO", b64Url: "AAcO" },
  { bytes: [0, 7, 14, 21, 28], b64: "AAcOFRw=", b64Url: "AAcOFRw" },
  {
    bytes: [0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98],
    b64: "AAcOFRwjKjE4P0ZNVFti",
    b64Url: "AAcOFRwjKjE4P0ZNVFti",
  },
];

describe("Common Utils", function () {
  it("b64UrlDecode() should throw on non-strings", () => {
    for (const value of nonStrings) {
      // @ts-ignore Ignoring to test non-strings
      expect(() => utils.b64UrlDecode(value)).to.throw(
        "Failed to decode string"
      );
    }
  });

  it("b64UrlEncode() should throw on non-strings", () => {
    for (const value of nonStrings) {
      // @ts-ignore Ignoring to test non-strings
      expect(() => utils.b64UrlEncode(value)).to.throw(
        "Failed to encode string"
      );
    }
  });

  it("bufferTob64() should encode to standard base64", () => {
    expect(
      vectors.map((v) => utils.bufferTob64(new Uint8Array(v.bytes)))
    ).to.deep.equal(vectors.map((v) => v.b64));
  });

  it("bufferTob64Url() should encode to url-safe base64", () => {
    expect(
      vectors.map((v) => utils.bufferTob64Url(new Uint8Array(v.bytes)))
    ).to.deep.equal(vectors.map((v) => v.b64Url));
  });

  it("b64UrlToBuffer() should decode url-safe base64", () => {
    expect(
      vectors.map((v) => Array.from(utils.b64UrlToBuffer(v.b64Url)))
    ).to.deep.equal(vectors.map((v) => v.bytes));
  });

  it("b64UrlToBuffer() should round trip a transaction id", () => {
    const txId = "Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE";

    expect(utils.b64UrlToBuffer(txId)).to.have.lengthOf(32);
    expect(utils.bufferTob64Url(utils.b64UrlToBuffer(txId))).to.equal(txId);
  });

  it("b64UrlToBuffer() should throw on malformed base64", () => {
    expect(() => utils.b64UrlToBuffer("aGVsb!8")).to.throw();
  });

  it("should round trip a utf-8 string", () => {
    expect(utils.b64UrlToString(utils.stringToB64Url("hello world"))).to.equal(
      "hello world"
    );
  });

  it("should round trip a buffer larger than the encoding chunk size", () => {
    const buffer = new Uint8Array(200_000);

    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = (i * 7) % 256;
    }

    const decoded = utils.b64UrlToBuffer(utils.bufferTob64Url(buffer));

    expect(Array.from(decoded)).to.deep.equal(Array.from(buffer));
  });
});
