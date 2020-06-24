/**
 * @see {@link https://github.com/ArweaveTeam/arweave/blob/fbc381e0e36efffa45d13f2faa6199d3766edaa2/apps/arweave/src/ar_merkle.erl}
 */
import Arweave from "../common";
import { concatBuffers } from "./utils";
import { inspect } from "util";

interface Chunk {
  dataHash: Uint8Array;
  minByteRange: number;
  maxByteRange: number;
}

interface BranchNode {
  readonly id: Uint8Array;
  readonly type: "branch";
  readonly byteRange: number;
  readonly maxByteRange: number;
  readonly leftChild?: MerkelNode;
  readonly rightChild?: MerkelNode;
}

interface LeafNode {
  readonly id: Uint8Array;
  readonly dataHash: Uint8Array;
  readonly type: "leaf";

  readonly minByteRange: number;
  readonly maxByteRange: number;
}

type MerkelNode = BranchNode | LeafNode;

const CHUNK_SIZE = 256 * 1024;
const NOTE_SIZE = 32;
const HASH_SIZE = 32;

/**
 * Takes the input data and chunks it into (mostly) equal sized chunks.
 * The last chunk will be a bit smaller as it contains the remainder
 * from the chunking process.
 */
async function chunkData(data: Uint8Array): Promise<Chunk[]> {
  let chunks: Chunk[] = [];

  let rest = data;
  let cursor = 0;

  while (rest.byteLength >= CHUNK_SIZE) {
    const chunk = rest.slice(0, CHUNK_SIZE);
    const dataHash = await Arweave.crypto.hash(chunk);
    cursor += chunk.byteLength;
    chunks.push({
      dataHash,
      minByteRange: cursor - chunk.byteLength,
      maxByteRange: cursor,
    });
    rest = rest.slice(CHUNK_SIZE);
  }

  chunks.push({
    dataHash: await Arweave.crypto.hash(rest),
    minByteRange: cursor,
    maxByteRange: cursor + rest.byteLength,
  });

  return chunks;
}

async function generateLeaves(chunks: Chunk[]): Promise<LeafNode[]> {
  return Promise.all(
    chunks.map(
      async ({ dataHash, minByteRange, maxByteRange }): Promise<LeafNode> => {
        return {
          type: "leaf",
          id: await hash(
            await Promise.all([hash(dataHash), hash(intToBuffer(maxByteRange))])
          ),
          dataHash: dataHash,
          minByteRange,
          maxByteRange,
        };
      }
    )
  );
}

/**
 * Builds an arweave merkle tree and gets the root hash for the given input.
 */
export async function computeRootHash(data: Uint8Array): Promise<Uint8Array> {
  const rootNode = await generateTree(data);

  return rootNode.id;
}

export async function generateTree(data: Uint8Array): Promise<MerkelNode> {
  const rootNode = await buildLayers(
    await generateLeaves(await chunkData(data))
  );

  return rootNode;
}

/**
 * Starting with the bottom layer of leaf nodes, hash every second pair
 * into a new branch node, push those branch nodes onto a new layer,
 * and then recurse, building up the tree to it's root, where the
 * layer only consists of two items.
 */
async function buildLayers(
  nodes: MerkelNode[],
  level = 0
): Promise<MerkelNode> {
  // If there are only 2 nodes left, this is going to be the root node
  if (nodes.length < 2) {
    const root = await hashBranch(nodes[0], nodes[1]);

    // console.log("Root layer", root);

    return root;
  }

  const nextLayer: MerkelNode[] = [];

  for (let i = 0; i < nodes.length; i += 2) {
    nextLayer.push(await hashBranch(nodes[i], nodes[i + 1]));
  }

  // console.log("Layer", nextLayer);

  return buildLayers(nextLayer, level + 1);
}

/**
 * Recursively search through all branches of the tree,
 * and generate a proof for each leaf node.
 */
export function generateProofs(root: MerkelNode) {
  const proofs = resolveBranchProofs(root);
  return arrayFlatten<Proof>(proofs);
}

interface Proof {
  offset: number;
  proof: Uint8Array;
}

function resolveBranchProofs(
  node: MerkelNode,
  proof: Uint8Array = new Uint8Array(),
  depth = 0
): any {
  if (node.type == "leaf") {
    return {
      offset: node.maxByteRange - 1,
      proof: concatBuffers([
        proof,
        node.dataHash,
        intToBuffer(node.maxByteRange),
      ]),
    };
  }

  if (node.type == "branch") {
    const partialProof = concatBuffers([
      proof,
      node.leftChild!.id!,
      node.rightChild!.id!,
      intToBuffer(node.byteRange),
    ]);
    return [
      resolveBranchProofs(node.leftChild!, partialProof, depth + 1),
      resolveBranchProofs(node.rightChild!, partialProof, depth + 1),
    ] as [Proof, Proof];
  }
}

export function arrayFlatten<T = any>(input: T[]): T[] {
  const flat: any[] = [];

  input.forEach((item) => {
    if (Array.isArray(item)) {
      flat.push(...arrayFlatten(item));
    } else {
      flat.push(item);
    }
  });

  return flat;
}

async function hashBranch(
  left: MerkelNode,
  right: MerkelNode
): Promise<MerkelNode> {
  if (!right) {
    return left as BranchNode;
  }
  let branch = {
    type: "branch",
    id: await hash([
      await hash(left.id),
      await hash(right.id),
      await hash(intToBuffer(left.maxByteRange)),
    ]),
    byteRange: left.maxByteRange,
    maxByteRange: right.maxByteRange,
    leftChild: left,
    rightChild: right,
  } as BranchNode;

  return branch;
}

async function hash(data: Uint8Array | Uint8Array[]) {
  if (Array.isArray(data)) {
    data = Arweave.utils.concatBuffers(data);
  }

  return new Uint8Array(await Arweave.crypto.hash(data));
}

function intToBuffer(note: number): Uint8Array {
  const buffer = new Uint8Array(NOTE_SIZE);

  for (let i = NOTE_SIZE - 1; i > 0 && note > 0; i--, note = note >> 8) {
    buffer[i] = note;
  }

  return buffer;
}

function bufferToInt(buffer: Uint8Array): number {
  return buffer.reduce((carry, current) => (carry + current) << 8, 0) >> 8;
}

export const arrayCompare = (a: Uint8Array | any[], b: Uint8Array | any[]) =>
  a.every((value: any, index: any) => b[index] === value);

export async function validatePath(
  id: Uint8Array,
  dest: number,
  leftBound: number,
  rightBound: number,
  path: Uint8Array
): Promise<boolean> {
  if (rightBound <= 0) {
    return false;
  }

  if (dest >= rightBound) {
    return validatePath(id, 0, rightBound - 1, rightBound, path);
  }

  if (dest < 0) {
    return validatePath(id, 0, 0, rightBound, path);
  }

  if (path.length == HASH_SIZE + NOTE_SIZE) {
    const pathData = path.slice(0, HASH_SIZE);
    const endOffsetBuffer = path.slice(
      pathData.length,
      pathData.length + NOTE_SIZE
    );

    const pathDataHash = await hash([
      await hash(pathData),
      await hash(endOffsetBuffer),
    ]);

    return arrayCompare(id, pathDataHash);
  }

  const left = path.slice(0, HASH_SIZE);
  const right = path.slice(left.length, left.length + HASH_SIZE);
  const offsetBuffer = path.slice(
    left.length + right.length,
    left.length + right.length + NOTE_SIZE
  );
  const offset = bufferToInt(offsetBuffer);

  const remainder = path.slice(
    left.length + right.length + offsetBuffer.length
  );

  const pathHash = await hash([
    await hash(left),
    await hash(right),
    await hash(offsetBuffer),
  ]);

  if (arrayCompare(id, pathHash)) {
    if (dest < offset) {
      return await validatePath(
        left,
        dest,
        leftBound,
        Math.min(rightBound, offset),
        remainder
      );
    }
    return await validatePath(
      right,
      dest,
      Math.max(leftBound, offset),
      rightBound,
      remainder
    );
  }

  return false;
}

/**
 * Inspect an arweave chunk proof.
 * Takes proof, parses, reads and displays the values for console logging.
 * One proof section per line
 * Format: left,right,offset => hash
 */
export async function debug(proof: Uint8Array, output = ""): Promise<string> {
  if (proof.byteLength < 1) {
    return output;
  }

  const left = proof.slice(0, HASH_SIZE);
  const right = proof.slice(left.length, left.length + HASH_SIZE);
  const offsetBuffer = proof.slice(
    left.length + right.length,
    left.length + right.length + NOTE_SIZE
  );
  const offset = bufferToInt(offsetBuffer);

  const remainder = proof.slice(
    left.length + right.length + offsetBuffer.length
  );

  const pathHash = await hash([
    await hash(left),
    await hash(right),
    await hash(offsetBuffer),
  ]);

  const updatedOutput = `${output}\n${inspect(Buffer.from(left))},${inspect(
    Buffer.from(right)
  )},${offset} => ${inspect(pathHash)}`;

  return debug(remainder, updatedOutput);
}
