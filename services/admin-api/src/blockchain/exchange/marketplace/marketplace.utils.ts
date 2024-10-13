import { formatUnits } from "ethers";

import type { IAsset } from "@framework/types";

export const formatEther = (amount = 0n, decimals = 18, currency = "Ξ"): string => {
  return `${currency} ${formatUnits(amount, decimals)}`;
};

/**
 * @deprecated use formatItem
 */
export const formatPrice = (asset?: IAsset): string => {
  return (
    asset?.components
      .map(component => formatEther(component.amount, component.contract!.decimals, component.contract!.symbol))
      .join(", ") || ""
  );
};
