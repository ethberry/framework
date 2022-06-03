import { INetwork } from "../interfaces";

/* javascript-obfuscator:disable */
const jsonRpcUrl = process.env.JSON_RPC_ADDR;
const chainId = ~~process.env.CHAIN_ID;
/* javascript-obfuscator:enable */

export enum Networks {
  ETHEREUM = "ETHEREUM",
  ROPSTEN = "ROPSTEN",
  RINKEBY = "RINKEBY",
  GORLY = "GORLY",
  BINANCE = "BINANCE",
  BINANCE_TEST = "BINANCE_TEST",
  POLYGON = "POLYGON",
  MUMBAI = "MUMBAI",
  OPTIMISM = "OPTIMISM",
  ARBITRUM = "ARBITRUM",
  BESU = "BESU",
  CUSTOM = "CUSTOM",
}

export const networkToChainId = {
  [Networks.ETHEREUM]: 1,
  [Networks.ROPSTEN]: 3,
  [Networks.RINKEBY]: 4,
  [Networks.GORLY]: 5,
  [Networks.BINANCE]: 56,
  [Networks.BINANCE_TEST]: 97,
  [Networks.POLYGON]: 137,
  [Networks.MUMBAI]: 80001,
  [Networks.OPTIMISM]: 10,
  [Networks.ARBITRUM]: 42161,
  [Networks.BESU]: 1337,
  [Networks.CUSTOM]: chainId,
};

// information from https://chainlist.org/
export const rpcUrls: Record<number, string[]> = {
  [networkToChainId[Networks.ETHEREUM]]: [
    jsonRpcUrl,
    "https://main-rpc.linkpool.io",
    "https://eth-mainnet.public.blastapi.io",
    "https://eth-rpc.gateway.pokt.network",
  ],
  [networkToChainId[Networks.ROPSTEN]]: [jsonRpcUrl],
  [networkToChainId[Networks.RINKEBY]]: [jsonRpcUrl],
  [networkToChainId[Networks.GORLY]]: [jsonRpcUrl, "https://rpc.goerli.mudit.blog"],
  [networkToChainId[Networks.BINANCE]]: [
    jsonRpcUrl,
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
  ],
  [networkToChainId[Networks.BINANCE_TEST]]: [
    jsonRpcUrl,
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "http://data-seed-prebsc-1-s2.binance.org:8545",
    "http://data-seed-prebsc-2-s2.binance.org:8545",
    "https://data-seed-prebsc-1-s3.binance.org:8545",
    "https://data-seed-prebsc-2-s3.binance.org:8545",
  ],
  [networkToChainId[Networks.POLYGON]]: [
    jsonRpcUrl,
    "https://polygon-mainnet.public.blastapi.io",
    "https://matic-mainnet-archive-rpc.bwarelabs.com",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://polygon-rpc.com",
  ],
  [networkToChainId[Networks.MUMBAI]]: [
    jsonRpcUrl,
    "https://matic-mumbai.chainstacklabs.com",
    "https://matic-testnet-archive-rpc.bwarelabs.com",
    "https://rpc-mumbai.maticvigil.com",
  ],
  [networkToChainId[Networks.BESU]]: [jsonRpcUrl, "http://127.0.0.1:8545"],
  [networkToChainId[Networks.CUSTOM]]: [jsonRpcUrl],
};

export const networks: Record<number, INetwork> = {
  [networkToChainId[Networks.ETHEREUM]]: {
    chainName: "Ethereum Mainnet",
    chainId: `0x${networkToChainId[Networks.ETHEREUM].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.ETHEREUM]],
    blockExplorerUrls: ["https://etherscan.io/"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.ROPSTEN]]: {
    chainName: "Ropsten",
    chainId: `0x${networkToChainId[Networks.ROPSTEN].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.ROPSTEN]],
    blockExplorerUrls: ["https://ropsten.etherscan.io/"],
    nativeCurrency: {
      name: "ROP",
      symbol: "ROP",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.RINKEBY]]: {
    chainName: "Rinkeby",
    chainId: `0x${networkToChainId[Networks.RINKEBY].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.RINKEBY]],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
    nativeCurrency: {
      name: "RIN",
      symbol: "RIN",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.GORLY]]: {
    chainName: "Gorly",
    chainId: `0x${networkToChainId[Networks.GORLY].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.GORLY]],
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    nativeCurrency: {
      name: "GOR",
      symbol: "GOR",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.BINANCE]]: {
    chainName: "Binance Smart Chain Mainnet",
    chainId: `0x${networkToChainId[Networks.BINANCE].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.BINANCE]],
    blockExplorerUrls: ["https://bscscan.com/"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.BINANCE_TEST]]: {
    chainName: "Binance Smart Chain Testnet",
    chainId: `0x${networkToChainId[Networks.BINANCE_TEST].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.BINANCE_TEST]],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.POLYGON]]: {
    chainName: "Polygon Mainnet",
    chainId: `0x${networkToChainId[Networks.POLYGON].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.POLYGON]],
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.MUMBAI]]: {
    chainName: "Mumbai",
    chainId: `0x${networkToChainId[Networks.MUMBAI].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.MUMBAI]],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.BESU]]: {
    chainName: "Besu",
    chainId: `0x${networkToChainId[Networks.BESU].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.BESU]],
    blockExplorerUrls: ["http://localhost:8080/"],
    nativeCurrency: {
      name: "BESU",
      symbol: "BESU",
      decimals: 18,
    },
  },
  [networkToChainId[Networks.CUSTOM]]: {
    chainName: "Unidentified Custom Blockchain",
    chainId: `0x${networkToChainId[Networks.CUSTOM].toString(16)}`,
    rpcUrls: rpcUrls[networkToChainId[Networks.CUSTOM]],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

export const STORE_CONNECTOR = "CONNECTOR";

export const WALLET_CONNECT_POPUP_TYPE = Symbol("WALLET_CONNECT_POPUP_TYPE");
export const WALLET_MENU_POPUP_TYPE = Symbol("WALLET_MENU_POPUP_TYPE");
