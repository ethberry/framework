import { NotFoundException } from "@nestjs/common";

import { ChainLinkSupportedChains } from "@framework/types/dist/entities/integrations/chain-link/supported";
import { NodeEnv } from "@framework/types";

export const chainIdToSuffix = (chainId: bigint | number) => {
  switch (chainId) {
    case 1:
      return "Mainnet";
    case 5:
      return "Goerli";
    case 56:
      return "Binance";
    case 97:
      return "BinanceTestnet";
    case 137:
      return "Polygon";
    case 80001:
      return "PolygonTestnet";
    case 42161:
      return "Arbitrum";
    case 10000:
      return "Gemunion";
    case 13377:
      return "Gemunion";
    case 13378:
      return "Besu";
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
    path.includes("Mystery") ||
    path.includes("Loot") ||
    path.includes("Lottery") ||
    path.includes("Raffle");

  if (isRandom) {
    const isSupported = Object.values(ChainLinkSupportedChains).includes(Number(chainId));
    if (process.env.NODE_ENV !== NodeEnv.development && !isSupported) {
      throw new NotFoundException("randomNotSupportedChain", chainId.toString());
    }

    const suffix = chainIdToSuffix(chainId);
    fixedPath = path.replace(".sol", `${suffix}.sol`).replace(".json", `${suffix}.json`);
  }

  return import(fixedPath);
};
