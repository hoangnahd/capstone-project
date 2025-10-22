import fs from "fs";
import path from "path";
import { keccak256, solidityPackedKeccak256, getAddress, parseEther } from "ethers";
import { MerkleTree } from "merkletreejs";

interface WhitelistEntry {
  address: string;
  amount: number; // giá trị gốc (ví dụ 1000 MMT)
}

const whitelistPath = path.resolve("whitelist.json");
const whitelist = JSON.parse(fs.readFileSync(whitelistPath, "utf8")) as WhitelistEntry[];

// 🔥 Convert amount sang wei (ether thật)
const leaves = whitelist.map((entry) => {
  const weiAmount = parseEther(entry.amount.toString());
  return solidityPackedKeccak256(["address", "uint256"], [getAddress(entry.address), weiAmount]);
});

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();

console.log("🌳 Merkle Root:", root);

const proofs: Record<string, { amount: string; proof: string[] }> = {};

for (const entry of whitelist) {
  const weiAmount = parseEther(entry.amount.toString());
  const leaf = solidityPackedKeccak256(["address", "uint256"], [getAddress(entry.address), weiAmount]);
  proofs[getAddress(entry.address)] = { amount: weiAmount.toString(), proof: tree.getHexProof(leaf) };
}

fs.mkdirSync("../output", { recursive: true });
fs.writeFileSync("../output/merkleRoot.txt", root);
fs.writeFileSync("../output/proofs.json", JSON.stringify(proofs, null, 2));

console.log("✅ Merkle tree generated successfully (with ether-based amounts)!");
