import { utils } from "ethers";
import { TokenType } from "@framework/types";
import type { IAsset, IAssetComponent, IAssetComponentHistory, IAssetHistory } from "@framework/types";

export const formatEther = (amount = "0", decimals = 18, currency = "Ξ"): string => {
  return `${currency} ${utils.formatUnits(amount, decimals)}`;
};

export const formatMoney = (amount = 0, currency = "$"): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * @deprecated use formatItem
 */
export const formatPrice = (asset?: IAsset | IAssetHistory): string => {
  return (
    asset?.components
      .map((component: IAssetComponent | IAssetComponentHistory) =>
        formatEther(component.amount, component.contract!.decimals, component.contract!.symbol),
      )
      .join(", ") || ""
  );
};

export const formatItem = (asset?: IAsset): string => {
  return (
    asset?.components
      .map(component => {
        switch (component.contract?.contractType) {
          case TokenType.NATIVE:
          case TokenType.ERC20:
            return formatEther(component.amount, component.contract.decimals, component.contract.symbol);
          case TokenType.ERC721:
          case TokenType.ERC998:
            return component.template?.title;
          case TokenType.ERC1155:
            return BigInt(component.amount) > 1n
              ? `${component.amount} x ${component.template?.title}`
              : component.template?.title;
          default:
            return "unsupported token type";
        }
      })
      .join(", ") || ""
  );
};

export const formatPriceHistory = (components?: Array<IAssetComponentHistory>): string => {
  return (
    components
      ?.map((component, i) => {
        return formatPrice({ id: i, components: [component] });
      })
      .join(", ") || ""
  );
};

export const cleanUpAsset = ({ components }: IAsset = { components: [], id: 0 }) => {
  return {
    components: components.length
      ? components.map(({ id, tokenType, contractId, templateId, amount }) => ({
          id,
          tokenType,
          contractId,
          templateId,
          amount,
        }))
      : [],
  };
};
