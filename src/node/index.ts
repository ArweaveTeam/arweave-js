import DefaultArweave, { BaseArweave } from "./common";
import { ApiConfig } from "./lib/api";

class NodeArweave extends BaseArweave {
  constructor(apiConfig: ApiConfig = {}) {
    super(apiConfig);
  }

  public static init(apiConfig: ApiConfig = {}): NodeArweave {
    return new NodeArweave(apiConfig);
  }
}

// making it backwards compatible
DefaultArweave.init = NodeArweave.init;

export {
  DefaultArweave as Arweave,
  NodeArweave,
};

