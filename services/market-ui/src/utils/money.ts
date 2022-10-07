import { BigNumber, utils } from "ethers";
import { IAsset, TokenType } from "@framework/types";

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

export const formatPriceMl = (asset?: IAsset): Array<string> => {
  return (
    asset?.components.map(component =>
      formatEther(component.amount, component.contract!.decimals, component.contract!.symbol),
    ) || [""]
  );
};

export const getEthPrice = (asset?: IAsset) => {
  return asset?.components.reduce((memo, current) => {
    if (current.tokenType === TokenType.NATIVE) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};

export const cleanUpAsset = ({ components }: IAsset = { components: [], id: 0 }) => {
  return {
    components: components.map(({ id, tokenType, contractId, templateId, amount }) => ({
      id,
      tokenType,
      contractId,
      templateId,
      amount,
    })),
  };
};
