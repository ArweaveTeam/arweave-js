import * as chai from "chai";
import * as utils from "../../../src/common/lib/utils";

const expect = chai.expect;

describe("Common Utils", function () {
  describe("b64UrlDecode()", () => {
    for (const testCase of b64UrlDecodeValues()) {
      it(`should throw an error on non-strings: ${testCase.value}`, () => {
        try {
          // @ts-ignore Ignoring to test non-strings
          utils.b64UrlDecode(testCase.value);
        } catch (error) {
          expect(error).to.have.property("message");
          expect(error).to.have.property("cause");
          expect((error as Error).message).to.be.string(testCase.message);
        }
      });
    }
  });

  describe("b64UrlEncode()", () => {
    for (const testCase of b64UrlEncodeValues()) {
      it(`should throw an error on non-strings: ${testCase.value}`, () => {
        try {
          // @ts-ignore Ignoring to test non-strings
          utils.b64UrlEncode(testCase.value);
        } catch (error) {
          expect(error).to.have.property("message");
          expect(error).to.have.property("cause");
          expect((error as Error).message).to.be.string(testCase.message);
        }
      });
    }
  });

  describe("bufferTob64()", () => {
    for (const testCase of base64Vectors()) {
      it(`should encode ${testCase.bytes.length} bytes to standard base64`, () => {
        expect(utils.bufferTob64(new Uint8Array(testCase.bytes))).to.equal(
          testCase.b64
        );
      });
    }
  });

  describe("bufferTob64Url()", () => {
    for (const testCase of base64Vectors()) {
      it(`should encode ${testCase.bytes.length} bytes to url-safe base64`, () => {
        expect(utils.bufferTob64Url(new Uint8Array(testCase.bytes))).to.equal(
          testCase.b64Url
        );
      });
    }
  });

  describe("b64UrlToBuffer()", () => {
    for (const testCase of base64Vectors()) {
      it(`should decode ${testCase.bytes.length} bytes from url-safe base64`, () => {
        expect(
          Array.from(utils.b64UrlToBuffer(testCase.b64Url))
        ).to.deep.equal(testCase.bytes);
      });
    }

    it("should decode a real transaction id", () => {
      const txId = "Sgmyo7nUqPpVQWUfK72p5yIpd85QQbhGaWAF-I8L6yE";

      expect(utils.b64UrlToBuffer(txId)).to.have.lengthOf(32);
      expect(utils.bufferTob64Url(utils.b64UrlToBuffer(txId))).to.equal(txId);
    });

    it("should throw on malformed base64 rather than return corrupt bytes", () => {
      expect(() => utils.b64UrlToBuffer("aGVsb!8")).to.throw();
    });
  });

  describe("base64 round trip", () => {
    it("should round trip a utf-8 string", () => {
      expect(utils.b64UrlToString(utils.stringToB64Url("hello world"))).to.equal(
        "hello world"
      );
    });

    // Guards the chunking in bufferTob64: spreading a buffer this size into
    // String.fromCharCode in one call overflows the stack.
    it("should round trip a buffer larger than the encoding chunk size", () => {
      const buffer = new Uint8Array(200_000);

      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = (i * 7) % 256;
      }

      const decoded = utils.b64UrlToBuffer(utils.bufferTob64Url(buffer));

      expect(decoded).to.have.lengthOf(buffer.length);
      expect(Array.from(decoded)).to.deep.equal(Array.from(buffer));
    });
  });
});

/**
 * Expected values generated independently with node's Buffer, so these do not
 * encode the behaviour of whichever base64 implementation utils happens to use.
 */
function base64Vectors() {
  return [
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
}

function b64UrlDecodeValues() {
  return [
    { value: false, message: "Failed to decode string" },
    { value: undefined, message: "Failed to decode string" },
    { value: null, message: "Failed to decode string" },
    { value: true, message: "Failed to decode string" },
    { value: {}, message: "Failed to decode string" },
    { value: { test: "hello" }, message: "Failed to decode string" },
    { value: [], message: "Failed to decode string" },
    { value: ["1"], message: "Failed to decode string" },
  ];
}

function b64UrlEncodeValues() {
  return [
    { value: false, message: "Failed to encode string" },
    { value: undefined, message: "Failed to encode string" },
    { value: null, message: "Failed to encode string" },
    { value: true, message: "Failed to encode string" },
    { value: {}, message: "Failed to encode string" },
    { value: { test: "hello" }, message: "Failed to encode string" },
    { value: [], message: "Failed to encode string" },
    { value: ["1"], message: "Failed to encode string" },
  ];
}
