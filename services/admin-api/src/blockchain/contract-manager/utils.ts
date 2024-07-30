import { NotFoundException } from "@nestjs/common";

import { ChainLinkV2SupportedChains, NodeEnv } from "@framework/types";

export const chainIdToSuffix = (chainId: bigint | number) => {
  switch (chainId) {
    case 1:
      return "Ethereum";
    case 5:
      return "EthereumGoerli";
    case 56:
      return "Binance";
    case 97:
      return "BinanceTestnet";
    case 137:
      return "Polygon";
    case 80002:
      return "PolygonAmoy";
    case 42161:
      return "Arbitrum";
    case 10000:
    case 13377:
      return "Gemunion";
    case 13378:
    case 10001:
      return "Besu";
    default:
      return "";
  }
};

export const getContractABI = (path: string, chainId: bigint | number) => {
  let fixedPath = path;
  const isRandom =
    path.includes("Random") ||
    path.includes("Genes") ||
    path.includes("Loot") ||
    path.includes("Lottery") ||
    path.includes("Raffle");

  if (isRandom) {
    const isSupported = Object.values(ChainLinkV2SupportedChains).includes(Number(chainId));
    if (process.env.NODE_ENV === NodeEnv.production && !isSupported) {
      throw new NotFoundException("randomNotSupported", chainId.toString());
    }

    const suffix = chainIdToSuffix(chainId);
    fixedPath = path.replace(".sol", `${suffix}.sol`).replace(".json", `${suffix}.json`);
  }

  return import(fixedPath);
};
