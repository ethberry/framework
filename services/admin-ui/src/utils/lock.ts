import { NodeEnv } from "@framework/types";

export const optionsLock = (optionName: string): boolean => {
  const env: NodeEnv = process.env.NODE_ENV;
  const productionLock = [
    "AchievementsSection",
    "AssetPromoSection",
    "BreedSection",
    "CoinGeckoSection",
    "CoinMarketCapSection",
    "CollectionSection",
    "EcommerceSection",
    "Erc998Section",
    "LotterySection",
    "PaymentSplitterSection",
    "PonziSection",
    "ReferralSection",
    "RentSection",
    "StakingSection",
    "EthListenerAddButton",
    "EthListenerRemoveButton",
    "EthGetLogsButton",
  ];
  return !(env === NodeEnv.production && productionLock.includes(optionName));
};
