import fs from "fs";
import hre from "hardhat";

async function main() {
  const signers = await hre.network.provider.send("eth_accounts", []);

  // Mỗi người nhận 1000, 2000, 3000... MMT
  const whitelist = signers.slice(0, 5).map((addr: string, i: number) => ({
    address: addr,
    amount: (i + 1) * 1000, // Ether unit (sẽ chuyển sang wei sau)
  }));

  fs.writeFileSync("whitelist.json", JSON.stringify(whitelist, null, 2));
  console.log("✅ Generated whitelist.json (5 addresses with amounts):");
  console.table(whitelist);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
