export const networks = {
  "1": {
    order: 1,
    chainName: "Ethereum Mainnet",
    chainId: 1,
    rpcUrls: [
      "https://main-rpc.linkpool.io",
      "https://eth-mainnet.public.blastapi.io",
      "https://eth-rpc.gateway.pokt.network",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "11155111": {
    order: 9,
    chainName: "Ethereum Sepolia",
    chainId: 11155111,
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "56": {
    order: 3,
    chainName: "BNB Chain Mainnet",
    chainId: 56,
    rpcUrls: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  "97": {
    order: 4,
    chainName: "BNB Chain Testnet",
    chainId: 97,
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "http://data-seed-prebsc-1-s2.binance.org:8545",
      "http://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545",
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
  },
  "137": {
    order: 5,
    chainName: "Polygon Mainnet",
    chainId: 137,
    rpcUrls: [
      "https://polygon-mainnet.public.blastapi.io",
      "https://matic-mainnet-archive-rpc.bwarelabs.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://polygon-rpc.com",
    ],
    blockExplorerUrls: ["https://polygonscan.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  "80002": {
    order: 6,
    chainName: "Polygon Amoy",
    chainId: 80002,
    rpcUrls: [
      "https://rpc-amoy.polygon.technology",
      "https://rpc.ankr.com/polygon_amoy",
      "https://polygon-bor-amoy-rpc.publicnode.com",
    ],
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  "11111": {
    order: 7,
    chainName: "EthBerry Mainnet",
    chainId: 11111,
    rpcUrls: ["https://besu.ethberry.io"],
    blockExplorerUrls: ["https://besu-explorer.ethberry.io"],
    nativeCurrency: {
      name: "ETB",
      symbol: "ETB",
      decimals: 18,
    },
  },
  "10000": {
    order: 8,
    chainName: "EthBerry Testnet",
    chainId: 10000,
    rpcUrls: ["http://localhost:8545"],
    blockExplorerUrls: ["http://localhost:8080"],
    nativeCurrency: {
      name: "ETB",
      symbol: "ETB",
      decimals: 18,
    },
  },
};
