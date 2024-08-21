import { NotFoundException } from "@nestjs/common";

import { Networks } from "@gemunion/types-blockchain";
import { ChainLinkV2SupportedChains } from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

export const chainIdToSuffix = (chainId: bigint | number) => {
  switch (chainId) {
    case Networks.ETHEREUM:
      return "Ethereum";
    case Networks.ETHEREUM_SEPOLIA:
      return "EthereumSepolia";
    case Networks.BINANCE:
      return "Binance";
    case Networks.BINANCE_TEST:
      return "BinanceTestnet";
    case Networks.POLYGON:
      return "Polygon";
    case Networks.POLYGON_AMOY:
      return "PolygonAmoy";
    case Networks.ARBITRUM:
      return "Arbitrum";
    case Networks.ARBITRUM_SEPOLIA:
      return "ArbitrumSepolia";
    case Networks.GEMUNION:
      return "Gemunion";
    case Networks.GEMUNION_BESU:
      return "GemunionBesu";
    default:
      return "";
  }
};

export const getContractABI = (path: string, chainId: bigint | number) => {
  const isRandom = path.includes("Random") || path.includes("Genes") || path.includes("Loot");
  if (!isRandom) {
    return import(path);
  }

  const isSupported = Object.values(ChainLinkV2SupportedChains).includes(Number(chainId));
  if (process.env.NODE_ENV === NodeEnv.production && !isSupported) {
    throw new NotFoundException("randomNotSupported", chainId.toString());
  }

  const suffix = chainIdToSuffix(chainId);
  const fixedPath = path.replace(".sol", `${suffix}.sol`).replace(".json", `${suffix}.json`);
  return import(fixedPath);
};
