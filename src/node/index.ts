import Arweave from "./common";
import fetch, { Headers as NodeHeaders } from "node-fetch";
import { ApiConfig } from "./lib/api";

// @ts-expect-error
global.fetch = fetch;
global.Headers = NodeHeaders;

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  return new Arweave(apiConfig);
};

export = Arweave;
