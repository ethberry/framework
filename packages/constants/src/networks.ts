export const networks = {
  "1": {
    chainName: "Ethereum",
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
  "5": {
    chainName: "Goerly",
    chainId: 5,
    rpcUrls: ["https://rpc.goerli.mudit.blog"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    nativeCurrency: {
      name: "GOR",
      symbol: "GOR",
      decimals: 18,
    },
  },
  "56": {
    chainName: "Binance Smart Chain",
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
    chainName: "Binance Smart Chain Testnet",
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
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  "137": {
    chainName: "Polygon",
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
  "10000": {
    chainName: "Gemunion",
    chainId: 10000,
    rpcUrls: ["https://besu.gemunion.io"],
    blockExplorerUrls: ["https://besu-explorer.gemunion.io"],
    nativeCurrency: {
      name: "BESU",
      symbol: "BESU",
      decimals: 18,
    },
  },
  "10001": {
    chainName: "Besu",
    chainId: 10001,
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: ["http://localhost:8080"],
    nativeCurrency: {
      name: "BESU",
      symbol: "BESU",
      decimals: 18,
    },
  },
  "80001": {
    chainName: "Mumbai",
    chainId: 80001,
    rpcUrls: [
      "https://matic-mumbai.chainstacklabs.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
      "https://rpc-mumbai.maticvigil.com",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  "11155111": {
    chainName: "Sepolia",
    chainId: 11155111,
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    nativeCurrency: {
      name: "SETH",
      symbol: "SETH",
      decimals: 18,
    },
  },
};
