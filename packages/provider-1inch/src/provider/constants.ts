export enum Networks {
  ETHEREUM = "ETHEREUM",
  BINANCE = "BINANCE",
  POLYGON = "POLYGON",
  OPTIMISM = "OPTIMISM",
  ARBITRUM = "ARBITRUM",
}

export const networkToChainId = {
  [Networks.ETHEREUM]: 1,
  [Networks.BINANCE]: 56,
  [Networks.POLYGON]: 137,
  [Networks.OPTIMISM]: 10,
  [Networks.ARBITRUM]: 42161,
};

export const chainIdToNetwork: Record<number, Networks> = {
  1: Networks.ETHEREUM,
  56: Networks.BINANCE,
  137: Networks.POLYGON,
  10: Networks.OPTIMISM,
  42161: Networks.ARBITRUM,
};

export const GovernanceTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const stableCoinSymbol = "USDT";
