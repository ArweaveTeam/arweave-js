import Transaction from "./transaction";
import { generateTransactionChunks } from "./merkle";
import * as ArweaveUtils from "./utils";

/**
 * Prepares the chunks and data_root for a given transaction and data.
 * 
 * @param transaction 
 * @param data 
 */
export async function prepareChunks(transaction: Transaction, data: Uint8Array) {

  // @ts-ignore
  let chunks = transaction.chunks
  if (!chunks) {
    
    if (data.byteLength > 0) {
      chunks = await generateTransactionChunks(data);
      // @ts-ignore
      transaction.chunks = chunks;
      transaction.data_root = ArweaveUtils.bufferTob64Url(chunks.data_root)
    }

    // Handle zero length data: data_root = "" and empty chunks array.
    if (data.byteLength === 0) {
      chunks = {
        chunks: [],
        data_root: new Uint8Array(),
        proofs: [],
      }
      // @ts-ignore
      transaction.chunks = chunks;
      transaction.data_root = "";
    }
  }
  return;
}

export async function getChunk(idx: number, transaction: Transaction, data: Uint8Array) {
  // @ts-ignore
  let chunks = transaction.chunks
  
  if (!chunks) {
    throw new Error(`Chunks have not been prepared`);
  }
  const proof = chunks.proofs[idx];
  const chunk = chunks.chunks[idx];
  return {
    data_root: transaction.data_root,
    data_size: transaction.data_size,
    data_path: ArweaveUtils.bufferTob64Url(proof.proof),
    offset: proof.offset.toString(),
    chunk: ArweaveUtils.bufferTob64Url(data.slice(chunk.minByteRange, chunk.maxByteRange))
  };
}

export function getCachedTransactionChunks(transaction: Transaction) {
  // @ts-ignore
  return transaction.chunks
}


