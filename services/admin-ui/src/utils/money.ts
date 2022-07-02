import { utils } from "ethers";
import { IAsset } from "@framework/types";

export const formatEther = (amount = "0", decimals = 18, currency = "Ξ"): string => {
  return `${currency}${utils.formatUnits(amount, decimals)}`;
};

export const formatMoney = (amount = 0, currency = "$"): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatPrice = (asset?: IAsset): string => {
  return asset
    ? `${formatEther(
        asset.components[0].amount,
        asset.components[0].token!.template!.decimals,
        asset.components[0].token!.template!.contract!.symbol,
      )}}`
    : "";
};
