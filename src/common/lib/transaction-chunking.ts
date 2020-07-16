

import { MAX_CHUNK_SIZE, MIN_CHUNK_SIZE, Chunk } from "./merkle";
import Arweave from "../common";
import * as pMap from 'p-map';

// This will be stripped out during build, as we just using types from it.
import { promises } from "fs";

/**
 * Takes the input data and chunks it into (mostly) equal sized chunks.
 * The last chunk will be a bit smaller as it contains the remainder
 * from the chunking process.
 */
export function chunkData(data_size: number): Partial<Chunk>[] {
  let chunks: Partial<Chunk>[] = [];

  let remaining = data_size;
  let cursor = 0;
  let chunkSize = Number.NaN

  while (remaining >= MAX_CHUNK_SIZE) {

    chunkSize = MAX_CHUNK_SIZE; 
    
    // If the total bytes left will produce a chunk < MIN_CHUNK_SIZE, 
    // then adjust the amount we put in this 2nd last chunk.
    
    let nextChunkSize = remaining - MAX_CHUNK_SIZE
    if (nextChunkSize > 0 && nextChunkSize < MIN_CHUNK_SIZE) {  
      chunkSize = Math.ceil(remaining / 2)
      // console.log(`Last chunk will be: ${nextChunkSize} which is below ${MIN_CHUNK_SIZE}, adjusting current to ${chunkSize} with ${rest.byteLength} left.`)
    }

    chunks.push({
      minByteRange: cursor,
      maxByteRange: cursor + chunkSize,
    });

    remaining -= chunkSize;
    cursor += chunkSize;
  }

  chunks.push({
    minByteRange: cursor,
    maxByteRange: cursor + remaining
  });

  return chunks;
}


export async function calculateChunkHashes(data: Uint8Array | promises.FileHandle | Blob | ArrayBuffer): Promise<Chunk[]> {
  
  let sizes: Partial<Chunk>[]
  
  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    sizes = chunkData(data.byteLength);
    return chunksHashesFromUint8Array(sizes, data instanceof Uint8Array ? data : new Uint8Array(data));
  }

  // Blob is not defined outside the browser so we need to check it exists as a global.
  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    sizes = chunkData(data.size);
    return [];
  }

  // At this point the only type left is FileHandle but Ts fails 
  // to infer this and we check it with duck-typing in case. 
  if ((data as any).stat && (data as any).read ) {
    let file = data as promises.FileHandle;
    const stats = await file.stat();
    if (!stats.isFile()) {
      throw new Error(`File is not a plain file`);
    }
    sizes = chunkData(stats.size);
    return chunksHashesFromFile(sizes, file);
  }
  throw new Error(`Unexpected data format`);
}


async function chunksHashesFromUint8Array(chunks: Partial<Chunk>[], data: Uint8Array): Promise<Chunk[]> {
  
  // for whatever reason, this is slower if you do it more concurrently, in nodejs at least.

  await pMap(chunks, 
    async (chunk) => {
      if (chunk.maxByteRange! - chunk.minByteRange! === 0) {
        chunk.dataHash = await Arweave.crypto.hash(new Uint8Array(0));
        return; 
      }
      chunk.dataHash = await Arweave.crypto.hash(data.slice(chunk.minByteRange, chunk.maxByteRange));
    },
    { concurrency: 1 }
  );

  return chunks as Chunk[]
}

async function chunksHashesFromFile(chunks: Partial<Chunk>[], data: promises.FileHandle): Promise<Chunk[]> {
  
  await pMap(chunks, 
    async (chunk) => {
      if (chunk.maxByteRange! - chunk.minByteRange! === 0) {
        chunk.dataHash = await Arweave.crypto.hash(new Uint8Array(0));
        return; 
      }
      const buf = new Uint8Array(chunk.maxByteRange! - chunk.minByteRange!);
      await data.read(buf, chunk.minByteRange!)
      chunk.dataHash = await Arweave.crypto.hash(buf);
    },
    { concurrency: 1 }
  );

  return chunks as Chunk[]
}

async function chunksHashesFromBlob(chunks: Partial<Chunk>[], data: Blob): Promise<Chunk[]> {
  
  await pMap(chunks, 
    async (chunk) => {
      if (chunk.maxByteRange! - chunk.minByteRange! === 0) {
        chunk.dataHash = await Arweave.crypto.hash(new Uint8Array(0));
        return;
      }
      // @ts-ignore
      const buf = new Uint8Array(await data.slice(chunk.minByteRange, chunk.maxByteRange).arrayBuffer());
      chunk.dataHash = await Arweave.crypto.hash(buf);
    }, 
    { concurrency: 1 }
  );

  return chunks as Chunk[]
}


