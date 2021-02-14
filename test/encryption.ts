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

    expect(decrypted.toString()).to.equal(data.toString());
    expect(decrypted.toString()).to.equal(text);
  });

  it("should encrypt and decrypt using passphrase round trip", async function () {
    const text = "some data to encrypt";

    const data = Buffer.from(text);

    const key = "super-secret-password";

    const encrypted = await arweave.crypto.encrypt(data, key);

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key);

    expect(decrypted.toString()).to.equal(data.toString());

    expect(decrypted.toString()).to.equal(text);
  });

  it("should encrypt and decrypt using passphrase round trip and a salt", async function () {
    const text = "some data to encrypt";

    const data = Buffer.from(text);

    const key = "super-secret-password";

    const encrypted = await arweave.crypto.encrypt(data, key, 'hello arweave');

    expect(encrypted).to.have.lengthOf(48);

    const decrypted = await arweave.crypto.decrypt(encrypted, key, 'hello arweave');

    expect(decrypted.toString()).to.equal(data.toString());

    expect(decrypted.toString()).to.equal(text);
  });
});
