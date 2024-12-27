use k256::ecdsa::{VerifyingKey, signature::Verifier, SigningKey, Signature, signature::Signer};
use k256::sha2::Digest;
use rand_core::{OsRng, RngCore}; // requires 'getrandom' feature
use std::fs::File;
use std::io::{Write, Read};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct JwkKey {
    kty: String,
    crv: String,
    x: String,
    y: String,
    d: Option<String>,
}
use base64::{engine::general_purpose, Engine as _};
fn main() {
    let message_size = 2048;
    let mut rng = OsRng;
    let mut message = vec![0u8; message_size];
    rng.fill_bytes(&mut message);
    let engine = &general_purpose::URL_SAFE_NO_PAD;

    let mut file = File::create("msg.bin").unwrap();
    file.write_all(&message).unwrap();
    let digest = k256::sha2::Sha256::digest(&message);

    let signing_key = SigningKey::random(&mut OsRng);
    let sk_jwk = JwkKey {
        kty: "EC".to_string(),
        crv: "secp256k1".to_string(),
        x: engine.encode(signing_key.verifying_key().to_encoded_point(false).x().unwrap()),
        y: engine.encode(signing_key.verifying_key().to_encoded_point(false).y().unwrap()),
        d: Some(engine.encode(signing_key.to_bytes())),
    };
    let sk_file = File::create("sk.json").unwrap();
    serde_json::to_writer(sk_file, &sk_jwk).unwrap();
    let signature: Signature = signing_key.sign(&digest);
    let mut file = File::create("sig.bin").unwrap();
    file.write_all(&signature.to_bytes()).unwrap();

    let verifying_key = VerifyingKey::from(&signing_key);
    let pk_jwk = JwkKey {
        kty: "EC".to_string(),
        crv: "secp256k1".to_string(),
        x: engine.encode(signing_key.verifying_key().to_encoded_point(false).x().unwrap()),
        y: engine.encode(signing_key.verifying_key().to_encoded_point(false).y().unwrap()),
        d: None
    };
    let pk_file = File::create("pk.json").unwrap();
    serde_json::to_writer(pk_file, &pk_jwk).unwrap();
    assert!(verifying_key.verify(&digest, &signature).is_ok());
}
