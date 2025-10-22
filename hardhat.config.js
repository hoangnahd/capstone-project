import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";


dotenv.config();

const PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY || "";
const ETHERSCAN_API = process.env.ETHERSCAN_API || "";

const config = {
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
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};

export default config;
