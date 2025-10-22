import fs from "fs";
import path from "path";
import { buildMerkleTree, getLeaf } from "./utils";

const whitelistPath = path.resolve("whitelist.json");
const whitelist = JSON.parse(fs.readFileSync(whitelistPath, "utf8")) as string[];
const proofs = JSON.parse(fs.readFileSync("output/proofs.json", "utf8"));
const root = fs.readFileSync("output/merkleRoot.txt", "utf8").trim();

const tree = buildMerkleTree(whitelist);

const addressToVerify = "0xDef4560000000000000000000000000000000001";
const proof = proofs[addressToVerify];

const isValid = tree.verify(proof, getLeaf(addressToVerify), root);

console.log(`Proof for ${addressToVerify}:`, proof);
console.log("Is valid?", isValid ? "✅ Yes" : "❌ No");
