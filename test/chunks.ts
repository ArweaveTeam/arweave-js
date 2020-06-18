import * as chai from "chai";
import { b64UrlToBuffer } from "../src/common/lib/utils";
import { validatePath } from "../src/common/lib/merkle";
const expect = chai.expect;

const root = b64UrlToBuffer("t-GCOnjPWxdox950JsrFMu3nzOE4RktXpMcIlkqSUTw");
const path = b64UrlToBuffer(
  "7EAC9FsACQRwe4oIzu7Mza9KjgWKT4toYxDYGjWrCdp0QgsrYS6AueMJ_rM6ZEGslGqjUekzD3WSe7B5_fwipgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAi3r3GojjGWpgoxl1BG6HssPgQRWqasSoNIOviZg8QI6z1utTnQ8OfE2tpn6vST0v3T72n7YW8U-Xy4k9ymX_iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAOfjIyBloFgUjZasOi_sydU1VkscXh4Rr9TfA-arh5V0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAA"
);

const offset = 786431;
const dataSize = 836907;

describe("Chunks", function() {
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

  it("should reject invalid offset", async function() {
    const invalidOffset = 999;

    expect(await validatePath(root, invalidOffset, 0, dataSize, path)).to.equal(
      false
    );
  });

  it("should reject invalid data size", async function() {
    const invalidDataSize = 999;

    expect(await validatePath(root, offset, 0, invalidDataSize, path)).to.equal(
      false
    );
  });
});
