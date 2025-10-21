import fs from "fs";
import path from "path";
import { buildMerkleTree, getLeaf } from "./utils";

const whitelistPath = path.resolve("whitelist.json");
const whitelist = JSON.parse(fs.readFileSync(whitelistPath, "utf8")) as string[];

const tree = buildMerkleTree(whitelist);
const root = tree.getHexRoot();

console.log("Merkle Root:", root);

const proofs: Record<string, string[]> = {};
for (const addr of whitelist) {
  proofs[addr] = tree.getHexProof(getLeaf(addr));
}

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/merkleRoot.txt", root);
fs.writeFileSync("output/proofs.json", JSON.stringify(proofs, null, 2));

console.log("✅ Merkle tree generated successfully!");
