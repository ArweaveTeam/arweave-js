// @ts-ignore
import * as asn from "arweave-asn1";

function urlize(base64: string): string {
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function hex2b64url(str: string): string {
  return urlize(Buffer.from(str, "hex").toString("base64"));
}

var RSAPublicKey = asn.define("RSAPublicKey", function() {
  this.seq().obj(this.key("n").int(), this.key("e").int());
});

var AlgorithmIdentifier = asn.define("AlgorithmIdentifier", function() {
  this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters")
      .optional()
      .any()
  );
});

var PublicKeyInfo = asn.define("PublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(AlgorithmIdentifier),
    this.key("publicKey").bitstr()
  );
});

var Version = asn.define("Version", function() {
  this.int({
    0: "two-prime",
    1: "multi"
  });
});

var OtherPrimeInfos = asn.define("OtherPrimeInfos", function() {
  this.seq().obj(
    this.key("ri").int(),
    this.key("di").int(),
    this.key("ti").int()
  );
});

var RSAPrivateKey = asn.define("RSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").use(Version),
    this.key("n").int(),
    this.key("e").int(),
    this.key("d").int(),
    this.key("p").int(),
    this.key("q").int(),
    this.key("dp").int(),
    this.key("dq").int(),
    this.key("qi").int(),
    this.key("other")
      .optional()
      .use(OtherPrimeInfos)
  );
});

var PrivateKeyInfo = asn.define("PrivateKeyInfo", function() {
  this.seq().obj(
    this.key("version").use(Version),
    this.key("algorithm").use(AlgorithmIdentifier),
    this.key("privateKey").bitstr()
  );
});

const RSA_OID = "1.2.840.113549.1.1.1";

function addExtras(obj: any, extras?: any): any {
  extras = extras || {};
  Object.keys(extras).forEach(function(key) {
    obj[key] = extras[key];
  });
  return obj;
}

function pad(hex: string): string {
  return hex.length % 2 === 1 ? "0" + hex : hex;
}

function decodeRsaPublic(buffer: any, extras?: any) {
  var key = RSAPublicKey.decode(buffer, "der");
  var e = pad(key.e.toString(16));
  var jwk = {
    kty: "RSA",
    n: bn2base64url(key.n),
    e: hex2b64url(e)
  };
  return addExtras(jwk, extras);
}

function decodeRsaPrivate(buffer: any, extras?: any) {
  var key = RSAPrivateKey.decode(buffer, "der");
  var e = pad(key.e.toString(16));
  var jwk = {
    kty: "RSA",
    n: bn2base64url(key.n),
    e: hex2b64url(e),
    d: bn2base64url(key.d),
    p: bn2base64url(key.p),
    q: bn2base64url(key.q),
    dp: bn2base64url(key.dp),
    dq: bn2base64url(key.dq),
    qi: bn2base64url(key.qi)
  };
  return addExtras(jwk, extras);
}

function decodePublic(buffer: any, extras?: any): any {
  var info = PublicKeyInfo.decode(buffer, "der");
  return decodeRsaPublic(info.publicKey.data, extras);
}

function decodePrivate(buffer: any, extras?: any): any {
  var info = PrivateKeyInfo.decode(buffer, "der");
  return decodeRsaPrivate(info.privateKey.data, extras);
}

function getDecoder(header: string): any {
  var match = /^-----BEGIN (RSA )?(PUBLIC|PRIVATE) KEY-----$/.exec(header);
  if (!match) {
    return null;
  }
  var isRSA = !!match[1];
  var isPrivate = match[2] === "PRIVATE";
  if (isPrivate) {
    return isRSA ? decodeRsaPrivate : decodePrivate;
  } else {
    return isRSA ? decodeRsaPublic : decodePublic;
  }
}
function parse(jwk: any): any {
  return {
    n: string2bn(jwk.n),
    e: string2bn(jwk.e),
    d: jwk.d && string2bn(jwk.d),
    p: jwk.p && string2bn(jwk.p),
    q: jwk.q && string2bn(jwk.q),
    dp: jwk.dp && string2bn(jwk.dp),
    dq: jwk.dq && string2bn(jwk.dq),
    qi: jwk.qi && string2bn(jwk.qi)
  };
}

function bn2base64url(bn: any): any {
  return hex2b64url(pad(bn.toString(16)));
}

function base64url2bn(str: string): any {
  return new asn.bignum(Buffer.from(str, "base64"));
}

function string2bn(str: string): any {
  if (/^[0-9]+$/.test(str)) {
    return new asn.bignum(str, 10);
  }
  return base64url2bn(str);
}

export function pemTojwk(pem: any, extras?: any): any {
  var text = pem.toString().split(/(\r\n|\r|\n)+/g);
  text = text.filter(function(line: string) {
    return line.trim().length !== 0;
  });
  var decoder = getDecoder(text[0]);

  text = text.slice(1, -1).join("");
  return decoder(
    Buffer.from(text.replace(/[^\w\d\+\/=]+/g, ""), "base64"),
    extras
  );
}

export function jwkTopem(json: any): any {
  var jwk = parse(json);
  var isPrivate = !!jwk.d;
  var t = isPrivate ? "PRIVATE" : "PUBLIC";
  var header = "-----BEGIN RSA " + t + " KEY-----\n";
  var footer = "\n-----END RSA " + t + " KEY-----\n";
  var data = Buffer.alloc(0);
  if (isPrivate) {
    jwk.version = "two-prime";
    data = RSAPrivateKey.encode(jwk, "der");
  } else {
    data = RSAPublicKey.encode(jwk, "der");
  }
  var body = data
    .toString("base64")
    .match(/.{1,64}/g)
    .join("\n");
  return header + body + footer;
}
