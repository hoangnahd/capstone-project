import { Wallet, JsonRpcProvider, Contract } from "ethers";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // 1️⃣ Setup provider (Sepolia)
  const PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY || "";
  const provider = new JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

  // 2️⃣ Create wallet from private key
  if (!PRIVATE_KEY) throw new Error("No TESTNET_PRIVATE_KEY in .env");
  const wallet = new Wallet(PRIVATE_KEY, provider);
  console.log(`🧑‍💻 Using wallet: ${wallet.address}`);

  // 3️⃣ Proxy & Token addresses
  const proxyAddress = "0x4F30df1A382d8580115f9208cFBB1CCe312DCE9A";
  const tokenAddress = "0x83B2a62b482eEd236bA859dAA7942068095249D5";

  // 4️⃣ Load Merkle proofs
  const proofsPath = path.resolve(__dirname, "../output/proofs.json");
  const proofsRaw = fs.readFileSync(proofsPath, "utf8");
  const proofs: Record<string, { amount: string; proof: string[] }> = JSON.parse(proofsRaw);
  console.log(wallet.address)
  const entry = proofs[wallet.address];
  if (!entry) throw new Error("❌ Address not in whitelist!");

  const amount = entry.amount; // wei as string
  const proof = entry.proof;

  // 5️⃣ Connect to contracts
  const airdropAbi = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../artifacts/contracts/MerkleAirdropUpgradeable.sol/MerkleAirdropUpgradeable.json"),
      "utf8"
    )
  ).abi;

  const tokenAbi = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../artifacts/contracts/MyMintableToken.sol/MyMintableToken.json"),
      "utf8"
    )
  ).abi;

  const airdrop = new Contract(proxyAddress, airdropAbi, wallet);
  const token = new Contract(tokenAddress, tokenAbi, wallet);

  // 6️⃣ Check balance before
  const balanceBefore = await token.balanceOf(wallet.address);
  console.log("💰 Balance before claim:", balanceBefore.toString());

  // 7️⃣ Claim
  console.log("⏳ Sending claim transaction...");
  const tx = await airdrop.claim(amount, proof);
  await tx.wait();
  console.log("✅ Tokens claimed successfully!");

  // 8️⃣ Balance after
  const balanceAfter = await token.balanceOf(wallet.address);
  console.log("💰 Balance after claim:", balanceAfter.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
