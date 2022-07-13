import { utils, BigNumber } from "ethers";
import { IAsset, ITemplate, TokenType } from "@framework/types";

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

export const getEthPrice = (template: ITemplate) => {
  return template.price?.components.reduce((memo, current) => {
    if (current.tokenType === TokenType.NATIVE) {
      memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};
