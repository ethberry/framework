import { NotFoundException } from "@nestjs/common";

import { Networks } from "@ethberry/types-blockchain";
import { NodeEnv } from "@ethberry/constants";
import { ChainLinkV2SupportedChains } from "@framework/types";

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
    case Networks.ETHBERRY:
      return "Ethberry";
    case Networks.ETHBERRY_BESU:
      return "EthberryBesu";
    default:
      throw new Error("Unsupported chain");
  }
};

export const getContractABI = (path: string, chainId: bigint | number) => {
  const isChainLink = path.includes("networks");
  if (!isChainLink) {
    return import(path);
  }

  const isSupported = Object.values(ChainLinkV2SupportedChains).includes(Number(chainId));
  // TODO use configService
  if (process.env.NODE_ENV === NodeEnv.production && !isSupported) {
    throw new NotFoundException("chainLinkNotSupported", chainId.toString());
  }

  const suffix = chainIdToSuffix(chainId);
  const fixedPath = path.replace(".sol", `${suffix}.sol`).replace(".json", `${suffix}.json`);
  return import(fixedPath);
};
