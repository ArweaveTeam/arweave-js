import * as chai from "chai";

const expect = chai.expect;

let globals = <any>global;

// The web distro will attach to the browser's global object so we just
// need to mock a global self object with a subtle crypto stub
// to make this test work.
if (!globals.crypto) {
  globals.crypto = {
    subtle: {
      generateKey: async () => { },
      importKey: async () => { },
      exportKey: async () => { },
      digest: async () => { },
      sign: async () => { },
    },
  };

  globals.self = global;
}

describe("Node distribution", function () {
  it("should initialize from compiled node dist", async function () {
    const dist = require("../node");

    expect(dist).to.be.a("function");

    expect(dist.init).to.be.a("function");

    const instance = dist.init({ host: "arweave.net", logging: false });

    expect(instance.api.constructor.name).to.equal("Api");

    expect(instance.transactions.constructor.name).to.equal("Transactions");

    expect(instance.wallets.constructor.name).to.equal("Wallets");

    expect(instance.network.constructor.name).to.equal("Network");

    expect(instance.crypto.constructor.name).to.equal("NodeCryptoDriver");

    expect(instance.silo.constructor.name).to.equal("Silo");
  });
});

describe("Web distribution", function () {
  it("should initialize from web compiled dist", async function () {
    require("../web");

    const dist = globals.Arweave;

    expect(dist).to.be.a("function");

    expect(dist.init).to.be.a("function");

    const instance = dist.init({
      host: "arweave.net",
      protocol: "https",
      port: "443",
      logging: false,
    });

    expect(instance.api.constructor.name).to.equal("Api");

    expect(instance.transactions.constructor.name).to.equal("Transactions");

    expect(instance.wallets.constructor.name).to.equal("Wallets");

    expect(instance.network.constructor.name).to.equal("Network");

    expect(instance.crypto.constructor.name).to.equal("WebCryptoDriver");

    expect(instance.silo.constructor.name).to.equal("Silo");
  });

  it("should initialize from web bundle", async function () {
    require("../bundles/web.bundle");

    const dist = globals.Arweave;

    expect(dist).to.be.a("function");

    expect(dist.init).to.be.a("function");

    const instance = dist.init({
      host: "arweave.net",
      protocol: "https",
      port: "443",
      logging: false,
    });

    expect(instance.api.constructor.name).to.equal("Api");

    expect(instance.transactions.constructor.name).to.equal("Transactions");

    expect(instance.wallets.constructor.name).to.equal("Wallets");

    expect(instance.network.constructor.name).to.equal("Network");

    expect(instance.crypto.constructor.name).to.equal("WebCryptoDriver");

    expect(instance.silo.constructor.name).to.equal("Silo");
  });

  it("should initialize from minified web bundle", async function () {
    require("../bundles/web.bundle.min");

    const dist = globals.Arweave;

    expect(dist).to.be.a("function");

    expect(dist.init).to.be.a("function");

    const instance = dist.init({
      host: "arweave.net",
      protocol: "https",
      port: "443",
      logging: false,
    });

    expect(instance).to.be.an("object");
  });
});
