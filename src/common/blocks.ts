import Api from "./lib/api";
import ArweaveError, { ArweaveErrorType } from "./lib/error";
import { Tag } from "./lib/transaction";
import "arconnect";
import Network from "./network";

export interface BlockData {
  nonce: string;
  previous_block: string;
  timestamp: number;
  last_retarget: number;
  diff: string;
  height: number;
  hash: string;
  indep_hash: string;
  txs: string[];
  tx_root: string;
  wallet_list: string;
  reward_addr: string;
  tags: Tag[];
  reward_pool: number;
  weave_size: number;
  block_size: number;
  cumulative_diff: string;
  hash_list_merkle: string;
}

export default class Blocks {
  private static readonly ENDPOINT = "block/hash/";

  constructor(private readonly api: Api, private readonly network: Network) {}

  /**
   * Gets a block by its "indep_hash"
   */
  public async get(indepHash: string): Promise<BlockData> {
    const response = await this.api.get<BlockData>(
      `${Blocks.ENDPOINT}${indepHash}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      if (response.status === 404) {
        throw new ArweaveError(ArweaveErrorType.BLOCK_NOT_FOUND);
      } else {
        throw new Error(`Error while loading block data: ${response}`);
      }
    }
  }

  /**
   * Gets current block data (ie. block with indep_hash = Network.getInfo().current)
   */
  public async getCurrent(): Promise<BlockData> {
    const { current } = await this.network.getInfo();
    return await this.get(current);
  }
}
