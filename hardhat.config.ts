import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY || "";
const ETHERSCAN_API = process.env.ETHERSCAN_API || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},

    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      timeout: 40000,
    },

    // mainnet: {
    //   url: "https://eth-mainnet.public.blastapi.io",
    //   accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    //   timeout: 60000,
    // },
  }, 
  namedAccounts: {
    deployer: {
      default: 0, // index trong accounts array
      sepolia: 0, // chỉ định index deployer cho sepolia
    },
  },
  
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};

export default config;
