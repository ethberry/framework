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
      return "Mumbai";
    case 42161:
      return "Arbitrum";
    case 13377:
      return "Besu";
    case 13378:
      return "Gemunion";
    default:
      return "";
  }
};

export const getContractABI = (path: string, chainId: bigint | number) => {
  let fixedPath = path;
  const isRandom = path.includes("Random") || path.includes("Genes");
  if (isRandom) {
    const suffix = chainIdToSuffix(chainId);
    fixedPath = path.replace(".sol", `${suffix}.sol`).replace(".json", `${suffix}.json`);
  }
  return import(fixedPath);
};
