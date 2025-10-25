# Airdrop Smart Contract

This project implements an **upgradable airdrop smart contract** on Ethereum-compatible networks using **Hardhat**.  
It uses a **Merkle Tree-based whitelist** for secure token distribution and includes scripts for building, deploying, and testing the contract.

---

## 📁 Project Structure
```
.airzeppelin # OpenZeppelin project config
contracts # Smart contracts source code
deploy # Deployment scripts (upgradable contracts)
deployments/sepolia # Deployment info for Sepolia network
ignition/modules # Optional Hardhat Ignition modules
output # Output folder for Merkle root and proofs
scripts # Merkle tree and testing scripts
test # Contract test files
typechain-types # TypeScript types for contracts
```


---

## Scripts Overview

### `scripts/merkleTree/`
- **buildTree.ts** – Builds the Merkle Tree from whitelist addresses.  
- **generateWhitelist.ts** – Generates a JSON whitelist of eligible addresses.  
- **whitelist.json** – Contains whitelisted addresses for the airdrop.

### Other Scripts
- **test_airdrop.ts** – Tests the airdrop contract using generated Merkle proofs.

---

## Features

- **Upgradable Airdrop Contract** — Uses OpenZeppelin Upgradeable Contracts.
- **Merkle Tree Whitelist** — Efficient and private eligibility verification.
- **Token Minting** — Distributes ERC20 tokens via the airdrop.
- **Automated Deployment** — Hardhat deploy scripts for quick setup.
- **Comprehensive Testing** — Validate airdrop logic and Merkle proofs.

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-folder>
2. **Install dependencies**
   ```bash
   npm install
3. **Create a .env file**
   ```bash
   TESTNET_PRIVATE_KEY=<your-private-key>
   RPC_URL=<your-rpc-endpoint>
   
## Deployment

Deploy the upgradable airdrop contract:

  ```bash
  npx hardhat deploy
  ```
## Testing the Airdrop

Navigate to the scripts folder and run the test script:
  ```bash
  cd scripts
  npx ts-node test_airdrop.ts
  ```

This will:

  Use whitelist.json and generated Merkle proofs

  Simulate claiming tokens through the Airdrop contract

  Verify Merkle proof validation and token minting

## Output

  The output/ folder contains:
  
  Merkle Root — Stored on-chain during deployment
  
  Proofs — Generated proofs for each whitelisted address
  
  These files are used in the test_airdrop.ts script for verification.

## Notes

  Ensure the whitelist.json file is generated before running deployment or test scripts.
  
  The contract is upgradable, allowing future upgrades without redeploying from scratch.
  
  Supports Sepolia or any other EVM-compatible testnet/mainnet.


Would you like me to append this section into the full README so you can copy one complete, polished file?


