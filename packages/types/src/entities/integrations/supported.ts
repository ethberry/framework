// this supposed to be official list of supported chains
// unfortunately it does not align with actual chains listed in the system
// https://support.opensea.io/en/articles/8867082-which-blockchains-are-compatible-with-opensea

export enum OpenSeaSupportedChains {
  ETHEREUM = 1,
  POLYGON = 137,
  KLAYTN = 8217,
  // SOLANA = null, not EVM
  ARBITRUM = 42161,
  ARBITRUM_NOVA = 42170,
  OPTIMISM = 10,
  AVALANCHE = 43114,
  // BINANCE = 56, removed
  ZORA = 7777777,
  BASE = 8453,
}
