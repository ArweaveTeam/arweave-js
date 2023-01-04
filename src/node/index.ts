import Arweave from "./common";
import fetch from "node-fetch";
import { ApiConfig } from "./lib/api";

// @ts-expect-error
global.fetch = fetch;

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  return new Arweave(apiConfig);
};

export = Arweave;
