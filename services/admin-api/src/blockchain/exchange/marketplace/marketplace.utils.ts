import { utils } from "ethers";

import { IAsset } from "@framework/types";

export const formatEther = (amount = "0", decimals = 18, currency = "Ξ"): string => {
  return `${currency} ${utils.formatUnits(amount, decimals)}`;
};

export const formatPrice = (asset?: IAsset): string => {
  return (
    asset?.components
      .map(component => formatEther(component.amount, component.contract!.decimals, component.contract!.symbol))
      .join(", ") || ""
  );
};
