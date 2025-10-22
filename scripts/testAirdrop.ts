import { ethers } from "hardhat";
import fs from "fs";
import { parseEther, formatEther } from "ethers";

async function main() {
  console.log("🚀 Bắt đầu deploy và test Airdrop...");

  // 1️⃣ Deploy Mintable Token
  const Token = await ethers.getContractFactory("MyMintableToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("✅ MyMintableToken deployed at:", await token.getAddress());

  // 2️⃣ Deploy AirdropMerkle contract
  const whitelist = JSON.parse(fs.readFileSync("./whitelist.json", "utf-8"));
  const merkleRoot = fs.readFileSync("../output/merkleRoot.txt", "utf-8").trim();

  const Airdrop = await ethers.getContractFactory("MerkleAirdropMinter");
  const airdrop = await Airdrop.deploy(await token.getAddress(), merkleRoot);
  await airdrop.waitForDeployment();
  console.log("✅ MerkleAirdropMinter deployed at:", await airdrop.getAddress());

  // 3️⃣ Pre-mint token cho Airdrop contract
  const totalAirdrop = parseEther("15000");
  const txMint = await token.mint(await airdrop.getAddress(), totalAirdrop);
  await txMint.wait();
  console.log("✅ Minted 15000 MMT to Airdrop contract");

  console.log("Merkle Root in contract:", await airdrop.merkleRoot());
  console.log("Merkle Root from script:", merkleRoot);

  // 4️⃣ Test claim
  const [owner, user] = await ethers.getSigners();

  const userAddress = user.address;
  console.log("👤 Test user address:", userAddress);

  // Lấy proof cho user
  const proofs = JSON.parse(fs.readFileSync("../output/proofs.json", "utf-8"));
  const userProof = proofs[userAddress];
  if (!userProof) {
    console.error("❌ Không tìm thấy proof cho user trong proofs.json");
    return;
  }

  console.log("🧾 User proof:", userProof);
  console.log("🧾 User amount:", userProof.amount);

  const airdropBalanceBefore = await token.balanceOf(airdrop.getAddress());
  console.log("💰 Airdrop contract balance before claim:", formatEther(airdropBalanceBefore));
  const claimAmount = BigInt(userProof.amount); // đã là wei

  // Claim token (transfer từ airdrop contract)
  const txClaim = (await airdrop.connect(user) as any).claim(userAddress, claimAmount, userProof.proof);

  const balance = await token.balanceOf(userAddress);
  console.log(`✅ ${userAddress} đã claim thành công`);
}

main().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
