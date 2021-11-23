import Api from "./lib/api";
import { getError } from "./lib/error";
import * as ArweaveUtils from "./lib/utils";

export interface TransactionOffsetResponse {
  size: string;
  offset: string;
}

export interface TransactionChunkResponse {
  chunk: string;
  data_path: string;
  tx_path: string;
}

export default class Chunks {
  constructor(private api: Api) {}

  async getTransactionOffset(id: string): Promise<TransactionOffsetResponse> {
    const resp = await this.api.get(`tx/${id}/offset`);
    if (resp.status === 200) {
      return resp.data;
    }
    throw new Error(`Unable to get transaction offset: ${getError(resp)}`);
  }

  async getChunk(
    offset: string | number | BigInt
  ): Promise<TransactionChunkResponse> {
    const resp = await this.api.get(`chunk/${offset}`);
    if (resp.status === 200) {
      return resp.data;
    }
    throw new Error(`Unable to get chunk: ${getError(resp)}`);
  }

  async getChunkData(offset: string | number | BigInt): Promise<Uint8Array> {
    const chunk = await this.getChunk(offset);
    const buf = ArweaveUtils.b64UrlToBuffer(chunk.chunk);
    return buf;
  }

  firstChunkOffset(offsetResponse: TransactionOffsetResponse): number {
    return parseInt(offsetResponse.offset) - parseInt(offsetResponse.size) + 1;
  }

  async downloadChunkedData(id: string): Promise<Uint8Array> {
    const offsetResponse = await this.getTransactionOffset(id);
    const size = parseInt(offsetResponse.size);
    const endOffset = parseInt(offsetResponse.offset);
    const startOffset = endOffset - size + 1;

    const data = new Uint8Array(size);
    let byte = 0;

    while (byte < size) {
      if (this.api.config.logging) {
        console.log(`[chunk] ${byte}/${size}`);
      }

      let chunkData;
      try {
        chunkData = await this.getChunkData(startOffset + byte);
      } catch (error) {
        console.error(
          `[chunk] Failed to fetch chunk at offset ${startOffset + byte}`
        );
        console.error(
          `[chunk] This could indicate that the chunk wasn't uploaded or hasn't yet seeded properly to a particular gatway/node`
        );
      }

      if (chunkData) {
        data.set(chunkData, byte);
        byte += chunkData.length;
      } else {
        throw new Error(`Coudn't complete data download at ${byte}/${size}`);
      }
    }

    return data;
  }
}
