import { utils } from "ethers";
import { IAsset } from "@framework/types";

export const formatEther = (amount = "0", currency = "Ξ"): string => {
  return `${currency}${utils.formatEther(amount)}`;
};

export const formatMoney = (amount = 0, currency = "$"): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatPrice = (asset: IAsset): string => {
  return `${formatEther(asset.components[0].amount, asset.components[0].uniToken!.uniTemplate!.uniContract!.symbol)}}`;
};
