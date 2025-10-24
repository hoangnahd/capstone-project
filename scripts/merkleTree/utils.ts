import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export function buildMerkleTree(addresses: string[]): MerkleTree {
  const leaves = addresses.map(addr =>
    Buffer.from(keccak256(addr).slice(2), "hex")
  );
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

export function getLeaf(address: string): Buffer {
  return Buffer.from(keccak256(address).slice(2), "hex");
}
