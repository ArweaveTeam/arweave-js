import Arweave from "../common";

interface TaggedChunk {
  id: Uint8Array;
  end: number;
}

/**
 * Partial representation of an Arweave merkle tree node containing only the
 * information necessary for generating the root hash
 */
interface HashNode {
  readonly id: Uint8Array;
  readonly max: number;
}

const CHUNK_SIZE = 256 * 1024;
const NOTE_SIZE = 32;
const HASH_SIZE = 32;

export async function computeRootHash(data: Uint8Array): Promise<Uint8Array> {
  let taggedChunks: TaggedChunk[] = [];

  {
    let rest = data;
    let pos = 0;

    while (rest.byteLength >= CHUNK_SIZE) {
      let chunk = rest.slice(0, CHUNK_SIZE);
      let id = await Arweave.crypto.hash(chunk);
      pos += chunk.byteLength;
      taggedChunks.push({ id, end: pos });
      rest = rest.slice(CHUNK_SIZE);
    }

    taggedChunks.push({
      id: await Arweave.crypto.hash(rest),
      end: pos + rest.byteLength
    });
  }

  let nodes: HashNode[] = await Promise.all(
    taggedChunks.map(({ id, end }) => hashLeaf(id, end))
  );

  while (nodes.length > 1) {
    let nextNodes: HashNode[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      nextNodes.push(await hashBranch(nodes[i], nodes[i + 1]));
    }
    nodes = nextNodes;
  }

  const [{ id: rootHash }] = nodes;
  return rootHash;
}

async function hashBranch(left: HashNode, right?: HashNode): Promise<HashNode> {
  if (!right) {
    return left;
  }

  return {
    id: await hash([
      await hash(left.id),
      await hash(right.id),
      await hash(intToBuffer(left.max))
    ]),
    max: right.max
  };
}

async function hashLeaf(data: Uint8Array, note: number): Promise<HashNode> {
  return {
    id: await hash([await hash(data), await hash(intToBuffer(note))]),
    max: note
  };
}

async function hash(data: Uint8Array | Uint8Array[]) {
  if (Array.isArray(data)) {
    data = Arweave.utils.concatBuffers(data);
  }

  return await Arweave.crypto.hash(data);
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

const arrayCompare = (a: Uint8Array, b: Uint8Array) =>
  a.every((value, index) => b[index] === value);

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
      await hash(endOffsetBuffer)
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
    await hash(offsetBuffer)
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
