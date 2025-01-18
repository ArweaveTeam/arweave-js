import Arweave from "./common";
import { ApiConfig } from "./lib/api";
import "./shims";

Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  return new Arweave(apiConfig);
};

export = Arweave;
