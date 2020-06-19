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
      await hash(noteToBuffer(left.max))
    ]),
    max: right.max
  };
}

async function hashLeaf(data: Uint8Array, note: number): Promise<HashNode> {
  return {
    id: await hash([await hash(data), await hash(noteToBuffer(note))]),
    max: note
  };
}

async function hash(data: Uint8Array | Uint8Array[]) {
  if (Array.isArray(data)) {
    data = Arweave.utils.concatBuffers(data);
  }

  return await Arweave.crypto.hash(data);
}

function noteToBuffer(note: number): Uint8Array {
  const buffer = new Uint8Array(NOTE_SIZE);

  for (let i = NOTE_SIZE - 1; i > 0 && note > 0; i--, note = note >> 8) {
    buffer[i] = note;
  }

  return buffer;
}
