import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";
import "hardhat-contract-sizer";
// import "hardhat-deploy";

import "./tasks";

config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
  // path: `.env`,
});

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 40966424, // default: 3e7
      gas: "auto",
    },
    besu: {
      url: process.env.JSON_RPC_ADDR_BESU,
      timeout: 142000,
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
        "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3", // 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },
    gemunion: {
      url: process.env.JSON_RPC_ADDR_GEMUNION,
      timeout: 30000,
      accounts: [
        process.env.GEMUNION_PRIVATE_KEY_STAGE, // 0xf6bD844ED9Ebd5FA533D0Ae26fD864aF6FD61Df2
        "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3", // 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },

    gemunionprod: {
      url: process.env.JSON_RPC_ADDR_GEMUNION,
      timeout: 30000,
      accounts: [
        process.env.GEMUNION_PRIVATE_KEY_PROD, // 0x7008594bB5764beDE9c0511b0E1322e7fC5048D3
        "0x93551a60e21c15bd7cf36eb98cadba972e44aed3e7405f3bcee3c8d8fcb03c95", // 0x61284003E50b2D7cA2B95F93857abB78a1b0F3Ca
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },
    binance: {
      url: process.env.JSON_RPC_ADDR_BINANCE,
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    // has to have underscore
    binance_test: {
      url: process.env.JSON_RPC_ADDR_BINANCE_TEST,
      chainId: 97,
      gasPrice: "auto",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    goerli: {
      url: process.env.JSON_RPC_ADDR_GOERLY,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 142000,
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
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000, // DO NOT CHANGE
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
  },
  contractSizer: {
    alphaSort: false,
    outputFile: "./framework-sizes.txt",
  },
} as HardhatUserConfig;
