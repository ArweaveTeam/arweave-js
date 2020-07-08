import Api from "./lib/api";
import { getError } from "./lib/error";

export interface TransactionOffsetResponse {
  size: string
  offset: string
}

export interface TransactionChunkResponse {
  chunk: string
  data_path: string 
  tx_path: string
}

export default class Chunks {

  constructor(private api: Api) {
  }
  
  async getTransactionOffset(tx: string): Promise<TransactionOffsetResponse> {
    const resp = await this.api.request().get(`/tx/${tx}/offset`)
    if (resp.status === 200) {
      return resp.data
    }
    throw new Error(`Unable to get transaction offset: ${getError(resp)}`);
  }

  async getChunk(offset: string | number | BigInt): Promise<TransactionChunkResponse> {
    const resp = await this.api.request().get(`/chunk/${offset}`);
    if (resp.status === 200) {
      return resp.data
    }
    throw new Error(`Unable to get chunk: ${getError(resp)}`);
  }

  firstChunkOffset(offsetResponse: TransactionOffsetResponse): number {
    return parseInt(offsetResponse.offset) - parseInt(offsetResponse.size) + 1;
  }

}