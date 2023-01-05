import Arweave from "./common";
import { ApiConfig } from "./lib/api";


Arweave.init = function (apiConfig: ApiConfig = {}): Arweave {
  return new Arweave(apiConfig);
};

export = Arweave;
