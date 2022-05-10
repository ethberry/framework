import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";

import "./tasks";

config();

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 1e10, // default: 3e7
    },
    besu: {
      url: `http://127.0.0.1:8545`,
      timeout: 142000,
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
        "93551a60e21c15bd7cf36eb98cadba972e44aed3e7405f3bcee3c8d8fcb03c95", // 0x61284003E50b2D7cA2B95F93857abB78a1b0F3Ca
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY_RINKEBY as string}`,
      gas: 2100000,
      gasPrice: 8000000000,
      timeout: 142000,
      accounts: [process.env.MM_PRIVATEKEY],
      // accounts: {
      //   mnemonic: process.env.MM_MNEMONIC,
      // },
      saveDeployments: true,
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
  },
} as HardhatUserConfig;
