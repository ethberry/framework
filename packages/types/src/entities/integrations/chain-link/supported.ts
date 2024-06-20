// https://docs.chain.link/resources/link-token-contracts

export enum ChainLinkV2SupportedChains {
  // BESU_LOCALHOST = 10001,
  // BESU_GEMUNION = 10000,
  //
  // TELOS_TEST = 41, // gemunion's vrf v2

  ETHEREUM = 1,
  // ETHEREUM_GOERLI = 5,
  ETHEREUM_SEPOLIA = 11155111,

  BINANCE = 56,
  BINANCE_TEST = 97,

  POLYGON = 137,
  // POLYGON_MUMBAI = 80001,
  POLYGON_AMOY = 80002,

  // GNOSIS = 100,

  AVALANCHE = 43114,
  AVALANCHE_FUJI = 43113,

  FANTOM = 250,
  FANTOM_TEST = 4002,

  ARBITRUM = 42161,
  ARBITRUM_SEPOLIA = 421614,
  // ARBITRUM_GOERLI = 421613, removed

  // OPTIMISM = 10,
  // OPTIMISM_SEPOLIA = 11155420,
  // OPTIMISM_GOERLI = 420, removed

  // MOONRIVER = 1285,

  // MOONBEAM = 1284,

  // METIS = 1088, // Andromeda

  // BASE = 8453,
  // BASE_SEPOLIA = 84532,
  // BASE_GOERLI = 84531, removed

  // CELO = 42220,
  // CELO_ALFAJORES = 44787,

  // SCROLL = 534352,
  // SCROLL_SEPOLIA = 534351,

  // LINEA = 59144,

  // ZKSYNC_ERA = 324,
  // ZKSYNC_GOERLI = 280,

  // POLYGON_ZKEVM = 1101,
  // POLYGON_ZKEVM_TEST = 1442,

  // WEMIX = 1111,
  // WEMIX_TEST = 1112,

  // KROMA = 255,
  // KROMA_SEPOLIA = 2358,

  // SOLANA = null, not EVM
}
