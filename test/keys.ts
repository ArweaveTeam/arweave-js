import { readFileSync } from "fs";
import * as chai from "chai";
import { arweaveInstance } from "./_arweave";
import {
  RSAPrivateKey,
  RSAPublicKey,
  SECP256k1PrivateKey,
  SECP256k1PublicKey,
} from "../src/common/lib/crypto/keys";
import { KeyType } from "../src/common/lib/crypto/keys/interface";

const expect = chai.expect;
const arweave = arweaveInstance();

describe("Crypto: EllipticCurve secp256k1", function () {
  it("test de/serialization sign/verify", async function () {
    const privKeyA = await arweave.wallets.generateKey({
      type: KeyType.EC_SECP256K1,
    });
    const privKeyAJWK = await privKeyA.serialize({ format: "jwk" });
    const privKeyAA = await SECP256k1PrivateKey.deserialize({
      format: "jwk",
      keyData: privKeyAJWK,
    });
    expect(privKeyA.type).to.be.equal(KeyType.EC_SECP256K1);
    expect(privKeyAJWK.crv).to.equal("secp256k1");
    expect(privKeyAJWK.kty).to.equal("EC");
    expect(privKeyAJWK).to.have.property("d");
    expect(privKeyAJWK).to.have.property("x");
    expect(privKeyAJWK).to.have.property("y");
    expect(privKeyAJWK).to.deep.equal(
      await privKeyAA.serialize({ format: "jwk" })
    );

    const pubKeyA = await privKeyA.public();
    const pubKeyAJWK = await pubKeyA.serialize({ format: "jwk" });
    const pubKeyAAJWK = await SECP256k1PublicKey.deserialize({
      format: "jwk",
      keyData: pubKeyAJWK,
    });

    expect(pubKeyA.type).to.equal(KeyType.EC_SECP256K1);
    expect(pubKeyAJWK.crv).to.equal("secp256k1");
    expect(pubKeyAJWK.kty).to.equal("EC");
    expect(pubKeyAJWK).to.not.have.property("d");
    expect(pubKeyAJWK).to.have.property("x");
    expect(pubKeyAJWK).to.have.property("y");
    expect(pubKeyAJWK.x).to.equal(privKeyAJWK.x);
    expect(pubKeyAJWK.y).to.equal(privKeyAJWK.y);
    expect(pubKeyAJWK).to.deep.equal(
      await pubKeyAAJWK.serialize({ format: "jwk" })
    );

    let payload = new Uint8Array(Math.random() * 1000);
    payload = crypto.getRandomValues(payload);
    const digest = new Uint8Array(
      await crypto.subtle.digest("SHA-256", payload)
    );
    const sigA = await privKeyA.sign({ payload: digest, isDigest: true });
    // deterministic signature
    expect(
      await privKeyA.sign({ payload: digest, isDigest: true })
    ).to.deep.equal(sigA);
    expect(await privKeyA.sign({ payload: payload })).to.deep.equal(sigA);
    const sigB = await (
      await SECP256k1PrivateKey.new()
    ).sign({ payload: digest, isDigest: true });

    expect(sigA.length).be.equal(65);
    expect([0, 1, 2, 3]).to.include(sigA[64]);
    expect(sigB.length).length.be.equal(65);
    expect([0, 1, 2, 3]).to.include(sigB[64]);
    expect(sigB).not.to.be.equal(sigA);
    expect(
      await pubKeyA.verify({ payload: digest, signature: sigA, isDigest: true })
    ).true;
    expect(
      await pubKeyA.verify({
        payload: digest,
        signature: sigA,
        isDigest: false,
      })
    ).false;
    expect(
      await pubKeyA.verify({
        payload: payload,
        signature: sigA,
        isDigest: false,
      })
    ).true;
    expect(
      await (
        await SECP256k1PublicKey.deserialize({
          format: "jwk",
          keyData: pubKeyAJWK,
        })
      ).verify({ payload: digest, signature: sigA, isDigest: true })
    ).true;
    expect(
      await pubKeyA.verify({ payload: digest, signature: sigB, isDigest: true })
    ).false;

    const raw = await pubKeyA.serialize({ format: "raw" });
    expect(raw.byteLength).to.equal(33);
    const identifier = await pubKeyA.identifier();
    expect(identifier.byteLength).to.equal(33);

    // recover pk from sig & data
    const recoveredPubKeyA = await SECP256k1PublicKey.recover({
      payload,
      isDigest: false,
      signature: sigA,
    });
    expect(await recoveredPubKeyA.serialize({ format: "raw" })).to.deep.equal(
      raw
    );

    const inValidDataPubKeyA = await SECP256k1PublicKey.recover({
      payload: Uint8Array.from([...payload, 0]),
      isDigest: false,
      signature: sigA,
    }).catch((_) => null);
    if (inValidDataPubKeyA !== null) {
      expect(
        await inValidDataPubKeyA.serialize({ format: "raw" })
      ).to.not.deep.equal(raw);
    }

    const inValidSigPubKeyA = await SECP256k1PublicKey.recover({
      payload,
      isDigest: false,
      signature: Uint8Array.from([0, ...sigA.slice(1)]),
    }).catch((_) => null);
    if (inValidSigPubKeyA !== null) {
      expect(
        await inValidSigPubKeyA.serialize({ format: "raw" })
      ).to.not.deep.equal(raw);
    }
  });

  it("Erlang Crypto Compatibility", async function () {
    const path = "./test/fixtures/erlang";
    const sk = JSON.parse(
      readFileSync(`${path}/sk.json`).toString()
    ) as JsonWebKey;
    const pk = JSON.parse(
      readFileSync(`${path}/pk.json`).toString()
    ) as JsonWebKey;

    const privKey = await SECP256k1PrivateKey.deserialize({
      format: "jwk",
      keyData: sk,
    });
    const pubKey = await SECP256k1PublicKey.deserialize({
      format: "jwk",
      keyData: pk,
    });
    expect((await privKey.serialize({ format: "jwk" }))["d"]).to.deep.equal(
      sk["d"]
    );
    expect((await pubKey.serialize({ format: "jwk" }))["x"]).to.deep.equal(
      pk["x"]
    );
    expect((await pubKey.serialize({ format: "jwk" }))["y"]).to.deep.equal(
      pk["y"]
    );
    expect(
      (await (await privKey.public()).serialize({ format: "jwk" }))["x"]
    ).to.deep.equal(pk["x"]);
    expect(
      (await (await privKey.public()).serialize({ format: "jwk" }))["y"]
    ).to.deep.equal(pk["y"]);

    const payload = readFileSync(`${path}/msg.bin`);
    const sig = new Uint8Array(readFileSync(`${path}/sig.bin`));
    expect(await (await privKey.public()).verify({ payload, signature: sig }))
      .true;
    expect(sig).to.deep.equal(await privKey.sign({ payload, isDigest: false }));
  });
});

describe("Crypto: RSA 65537", function () {
  this.timeout(20000);
  it("De/Serialization Sign/Verify", async function () {
    const privKeyA = await arweave.wallets.generateKey({
      type: KeyType.RSA_65537,
    });
    const privKeyAJWK = await privKeyA.serialize({ format: "jwk" });
    const privKeyAA = await RSAPrivateKey.deserialize({
      format: "jwk",
      keyData: privKeyAJWK,
      type: KeyType.RSA_65537,
    });
    expect(privKeyA.type).to.be.equal(KeyType.RSA_65537);
    expect(privKeyAJWK).to.include.keys(
      "kty",
      "n",
      "e",
      "d",
      "p",
      "q",
      "dp",
      "dq",
      "qi"
    );
    expect(privKeyAJWK.kty).to.equal("RSA");
    expect(privKeyAJWK.e).to.equal("AQAB");
    expect(privKeyAJWK).to.deep.equal(
      await privKeyAA.serialize({ format: "jwk" })
    );

    const pubKeyA = await privKeyA.public();

    const pubKeyAJWK = await pubKeyA.serialize({ format: "jwk" });

    const pubKeyAAJWK = await RSAPublicKey.deserialize({
      format: "jwk",
      keyData: pubKeyAJWK,
      type: KeyType.RSA_65537,
    });

    expect(pubKeyA.type).to.equal(KeyType.RSA_65537);
    expect(privKeyAJWK).to.include.keys("kty", "n", "e");
    expect(pubKeyAJWK).to.not.have.property("d");
    expect(privKeyAJWK.kty).to.equal("RSA");
    expect(privKeyAJWK.e).to.equal("AQAB");
    expect(pubKeyAJWK.n).to.equal(privKeyAJWK.n);
    expect(pubKeyAJWK).to.deep.equal(
      await pubKeyAAJWK.serialize({ format: "jwk" })
    );

    let payload = new Uint8Array(Math.random() * 1000);
    payload = crypto.getRandomValues(payload);
    const sigA = await privKeyA.sign({ payload });
    expect(sigA.length).be.equal(512);
    const sigB = await (await RSAPrivateKey.new()).sign({ payload });
    expect(sigB.length).length.be.equal(512);
    expect(sigB).not.to.be.equal(sigA);

    expect(await pubKeyA.verify({ payload, signature: sigA })).true;
    expect(
      await (
        await RSAPublicKey.deserialize({
          format: "jwk",
          keyData: pubKeyAJWK,
          type: KeyType.RSA_65537,
        })
      ).verify({ payload, signature: sigA })
    ).true;
    expect(await pubKeyA.verify({ payload, signature: sigB })).false;

    const raw = await pubKeyA.serialize({ format: "raw" });
    expect(raw.byteLength).to.equal(512);
    const identifier = await pubKeyA.identifier();
    expect(identifier.byteLength).to.equal(512);
  });
});
