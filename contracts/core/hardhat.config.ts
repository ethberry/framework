import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";

import "./tasks";

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 1e10, // default: 3e7
      gas: 7000000,
    },
    besu: {
      url: process.env.BESU_RPC_URL,
      timeout: 142000,
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
        "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3", // 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      timeout: 142000,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      gas: 2100000,
      gasPrice: 8000000000,
      timeout: 142000,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.4.18",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.7.6",
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
  },
  contractSizer: {
    alphaSort: true,
  },
} as HardhatUserConfig;
