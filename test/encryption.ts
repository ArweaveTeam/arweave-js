import * as chai from "chai";
import * as crypto from "crypto";
import { arweaveInstance } from "./_arweave";

const expect = chai.expect;

const arweave = arweaveInstance();
describe("Encryption", function () {
  this.timeout(10000);
  it("should encrypt and decrypt using key round trip", async function () {
    const text = "some data to encrypt";

    const data = Buffer.from(text);

    const key = crypto.randomBytes(32);

    const encrypted = await arweave.crypto.encrypt(data, key);

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key);

    expect(arweave.utils.bufferToString(decrypted)).to.equal(text);
  });

  it("should encrypt and decrypt using passphrase round trip", async function () {
    const text = "some data to encrypt";

    const data = Buffer.from(text);

    const key = "super-secret-password";

    const encrypted = await arweave.crypto.encrypt(data, key);

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key);

    expect(arweave.utils.bufferToString(decrypted)).to.equal(text);
  });

  it("should encrypt and decrypt using passphrase round trip and a salt", async function () {
    const text = "some data to encrypt";

    const data = Buffer.from(text);

    const key = "super-secret-password";

    const encrypted = await arweave.crypto.encrypt(data, key, "hello arweave");

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(
      encrypted,
      key,
      "hello arweave"
    );

    expect(arweave.utils.bufferToString(decrypted)).to.equal(text);
  });

  it("should decrypt data encrypted by the node:crypto driver", async function () {
    const fixture = require("./fixtures/node_driver_crypto.json");
    const keyBytes = new Uint8Array(32).map((_, i) => i);
    const cases: [string, string | Uint8Array, string?][] = [
      [fixture.encrypted.passphrase, fixture.passphrase],
      [fixture.encrypted.passphraseSalt, fixture.passphrase, fixture.salt],
      [fixture.encrypted.keyBytes, keyBytes],
    ];

    for (const [encrypted, key, salt] of cases) {
      const decrypted = await arweave.crypto.decrypt(
        arweave.utils.b64UrlToBuffer(encrypted),
        key,
        salt
      );
      expect(arweave.utils.bufferToString(decrypted)).to.equal(fixture.plaintext);
    }
  });

  it("should decrypt node:crypto data with a non-ASCII passphrase and salt", async function () {
    const { unicode } = require("./fixtures/node_driver_crypto.json");

    const decrypted = await arweave.crypto.decrypt(
      arweave.utils.b64UrlToBuffer(unicode.encrypted),
      unicode.passphrase,
      unicode.salt
    );

    expect(arweave.utils.bufferToString(decrypted)).to.equal(
      "some data to encrypt"
    );
  });

  it("should handle empty and block-aligned data like node:crypto", async function () {
    const fixture = require("./fixtures/node_driver_crypto.json");

    for (const { plaintext, encrypted } of fixture.sizes) {
      const data = arweave.utils.stringToBuffer(plaintext);
      // 16-byte IV, then PKCS#7 always adds 1–16 bytes of padding
      const expectedLength = 16 + (Math.floor(data.byteLength / 16) + 1) * 16;

      const fromOld = await arweave.crypto.decrypt(
        arweave.utils.b64UrlToBuffer(encrypted),
        fixture.passphrase
      );
      expect(arweave.utils.bufferToString(fromOld)).to.equal(plaintext);

      const reencrypted = await arweave.crypto.encrypt(data, fixture.passphrase);
      expect(reencrypted).to.have.lengthOf(expectedLength);
      const roundTrip = await arweave.crypto.decrypt(
        reencrypted,
        fixture.passphrase
      );
      expect(arweave.utils.bufferToString(roundTrip)).to.equal(plaintext);
    }
  });

  it("should encrypt string data as UTF-8, like the node:crypto driver", async function () {
    const text = "some data to encrypt ✓";

    // Not allowed by the types, but plain JS callers relied on it
    const encrypted = await arweave.crypto.encrypt(text as any, "pass");
    const decrypted = await arweave.crypto.decrypt(encrypted, "pass");

    expect(arweave.utils.bufferToString(decrypted)).to.equal(text);
  });

  it("should use a random IV for every encryption", async function () {
    const data = arweave.utils.stringToBuffer("some data to encrypt");

    const a = await arweave.crypto.encrypt(data, "super-secret-password");
    const b = await arweave.crypto.encrypt(data, "super-secret-password");

    expect(arweave.utils.bufferTob64(a.slice(0, 16))).to.not.equal(
      arweave.utils.bufferTob64(b.slice(0, 16))
    );
    expect(arweave.utils.bufferTob64(a)).to.not.equal(
      arweave.utils.bufferTob64(b)
    );
  });

  // AES-CBC has no integrity check: a wrong key only fails when the padding
  // comes out invalid. About 1 in 400 wrong keys decrypt to garbage instead of
  // throwing. This fixed passphrase is one that throws.
  it("should throw for a wrong passphrase", async function () {
    const fixture = require("./fixtures/node_driver_crypto.json");
    const encrypted = arweave.utils.b64UrlToBuffer(
      fixture.encrypted.passphrase
    );

    await arweave.crypto.decrypt(encrypted, "wrong passphrase").then(
      () => expect.fail("decrypt should have thrown"),
      (error) => expect(error).to.be.an.instanceOf(Error)
    );
  });
});
