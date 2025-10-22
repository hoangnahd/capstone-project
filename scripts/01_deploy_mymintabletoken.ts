import { ethers } from "hardhat";

async function main() {
  // ✅ Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying from:", deployer.address);

  // ✅ Deploy contract
  const TokenFactory = await ethers.getContractFactory("MyMintableToken");
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ MyMintableToken deployed at:", tokenAddress);

  // ✅ Mint 1000 tokens to deployer
  const decimals = await token.decimals();
  const amount = ethers.parseUnits("1000", decimals);

  const mintTx = await token.mint(deployer.address, amount);
  await mintTx.wait();
  console.log(`🪙 Minted 1000 tokens to ${deployer.address}`);

  // ✅ Print deployer balance
  const balance = await token.balanceOf(deployer.address);
  console.log("💰 Balance:", ethers.formatUnits(balance, decimals), "MMT");
}

// ✅ Run the script
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
