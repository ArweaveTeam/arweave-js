import { readFileSync } from "fs";
import * as chai from "chai";

import { EllipticCurvePrivateKey, EllipticCurvePublicKey, SECP256k1PrivateKey, SECP256k1PublicKey } from "../../src/common/lib/crypto/keys";
import { KeyType } from "../../src/common/lib/crypto/keys/interface";
import { subtle } from "crypto";

const expect = chai.expect;

describe("Crypto: EdwardsCurve 25519", function () {
    it("De/Serialization Sign/Verify", async function() {
        const privKeyA = await EllipticCurvePrivateKey.new();
        const privKeyAJWK = await privKeyA.serialize();
        const privKeyAA = await EllipticCurvePrivateKey.deserialize({format: "jwk", keyData: privKeyAJWK, type: KeyType.ED_25519});
        
        expect(privKeyA.type).to.be.equal(KeyType.ED_25519);
        expect(privKeyAJWK.crv).to.equal('Ed25519');
        expect(privKeyAJWK.kty).to.equal('OKP');
        expect(privKeyAJWK).to.have.property('d');
        expect(privKeyAJWK).to.have.property('x');
        expect(privKeyAJWK).to.deep.equal(await privKeyAA.serialize());
        
        
        const pubKeyA = await privKeyA.public();
        const pubKeyAJWK = await pubKeyA.serialize();
        const pubKeyAAJWK = await EllipticCurvePublicKey.deserialize({format: "jwk", keyData: pubKeyAJWK, type: KeyType.ED_25519});
        
        expect(pubKeyA.type).to.equal(KeyType.ED_25519);
        expect(pubKeyAJWK.crv).to.equal('Ed25519');
        expect(pubKeyAJWK.kty).to.equal('OKP');
        expect(pubKeyAJWK).to.not.have.property('d');
        expect(pubKeyAJWK).to.have.property('x');
        expect(pubKeyAJWK.x).to.equal(privKeyAJWK.x);
        expect(pubKeyAJWK).to.deep.equal(await pubKeyAAJWK.serialize());
        
        
        let payload = new Uint8Array(Math.random() * 1000);
        payload = crypto.getRandomValues(payload);
        const sigA = await privKeyA.sign(payload);
        const sigB = await (await EllipticCurvePrivateKey.new()).sign(payload);
        
        expect(sigA.length).be.equal(64);
        expect(sigB.length).length.be.equal(64); 
        expect(sigB).not.to.be.equal(sigA);
        expect(await pubKeyA.verify(payload, sigA)).true;
        expect(await pubKeyA.verify(payload, sigB)).false;

        // add raw format serialziation tests
    });
    it("Erlang Crypto Compatibility", async function() {
    });
    it("RustCrypto-k256 Compatibility", async function() {
    });
});

describe("Crypto: EllipticCurve secp256k1", function () {
    it("test de/serialization sign/verify", async function() {
        const privKeyA = await SECP256k1PrivateKey.new();
        const privKeyAJWK = await privKeyA.serialize();
        const privKeyAA = await SECP256k1PrivateKey.deserialize({format: "jwk", keyData: privKeyAJWK});
        expect(privKeyA.type).to.be.equal(KeyType.EC_SECP256K1);
        expect(privKeyAJWK.crv).to.equal('secp256k1');
        expect(privKeyAJWK.kty).to.equal('EC');
        expect(privKeyAJWK).to.have.property('d');
        expect(privKeyAJWK).to.have.property('x');
        expect(privKeyAJWK).to.have.property('y');
        expect(privKeyAJWK).to.deep.equal(await privKeyAA.serialize());


        const pubKeyA = await privKeyA.public();
        const pubKeyAJWK = await pubKeyA.serialize();
        const pubKeyAAJWK = await SECP256k1PublicKey.deserialize({format: "jwk", keyData: pubKeyAJWK});
        
        expect(pubKeyA.type).to.equal(KeyType.EC_SECP256K1);
        expect(pubKeyAJWK.crv).to.equal('secp256k1');
        expect(pubKeyAJWK.kty).to.equal('EC');
        expect(pubKeyAJWK).to.not.have.property('d');
        expect(pubKeyAJWK).to.have.property('x');
        expect(pubKeyAJWK).to.have.property('y');
        expect(pubKeyAJWK.x).to.equal(privKeyAJWK.x);
        expect(pubKeyAJWK.y).to.equal(privKeyAJWK.y);
        expect(pubKeyAJWK).to.deep.equal(await pubKeyAAJWK.serialize());
        

        let payload = new Uint8Array(Math.random() * 1000);
        payload = crypto.getRandomValues(payload);
        const digest = await crypto.subtle.digest("SHA-256", payload) as Uint8Array;
        const sigA = await privKeyA.sign(digest);
        const sigB = await (await SECP256k1PrivateKey.new()).sign(digest);

        expect(sigA.length).be.equal(64);
        expect(sigB.length).length.be.equal(64); 
        expect(sigB).not.to.be.equal(sigA);
        expect(await pubKeyA.verify(digest, sigA)).true;
        expect(await (await SECP256k1PublicKey.deserialize({format: "jwk", keyData: pubKeyAJWK})).verify(digest, sigA)).true;
        expect(await pubKeyA.verify(digest, sigB)).false;
        
        // add raw format serialziation tests
    });
    it("Erlang Crypto Compatibility", async function() {
        const path = "./test/crypto/fixtures/erlang";
        const sk = JSON.parse(readFileSync(`${path}/sk.json`).toString()) as JsonWebKey;
        const pk = JSON.parse(readFileSync(`${path}/pk.json`).toString()) as JsonWebKey;

        const privKey = await SECP256k1PrivateKey.deserialize({format: "jwk", keyData: sk});
        const pubKey = await SECP256k1PublicKey.deserialize({format: "jwk", keyData: pk});
        expect((await privKey.serialize())['d']).to.deep.equal(sk['d']);
        expect((await pubKey.serialize())['x']).to.deep.equal(pk['x']);
        expect((await pubKey.serialize())['y']).to.deep.equal(pk['y']);
        expect((await (await privKey.public()).serialize())['x']).to.deep.equal(pk['x']);
        expect((await (await privKey.public()).serialize())['y']).to.deep.equal(pk['y']);

        const msg = readFileSync(`${path}/msg.bin`);
        const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", msg));  
        const sig = new Uint8Array(readFileSync(`${path}/sig.bin`));
        expect(await (await privKey.public()).verify(digest, sig)).true
    });

    it("RustCrypto-k256 Compatibility", async function() {
        const path = "./test/crypto/fixtures/RustCrypto-k256";
        const sk = JSON.parse(readFileSync(`${path}/sk.json`).toString()) as JsonWebKey;
        const pk = JSON.parse(readFileSync(`${path}/pk.json`).toString()) as JsonWebKey;

        const privKey = await SECP256k1PrivateKey.deserialize({format: "jwk", keyData: sk});
        const pubKey = await SECP256k1PublicKey.deserialize({format: "jwk", keyData: pk});

        expect((await privKey.serialize())['d']).to.deep.equal(sk['d']);
        expect((await pubKey.serialize())['x']).to.deep.equal(pk['x']);
        expect((await pubKey.serialize())['y']).to.deep.equal(pk['y']);
        expect((await (await privKey.public()).serialize())['x']).to.deep.equal(pk['x']);
        expect((await (await privKey.public()).serialize())['y']).to.deep.equal(pk['y']);

        const msg = readFileSync(`${path}/msg.bin`);
        const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", msg));  
        const sig = new Uint8Array(readFileSync(`${path}/sig.bin`));
        expect(await (await privKey.public()).verify(digest, sig)).true
    });
});