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
});

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
