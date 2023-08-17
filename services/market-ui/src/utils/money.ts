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
              ? `${component.amount} ${component.template?.title}`
              : component.template?.title;
          default:
            return "unsupported token type";
        }
      })
      .join(", ") || ""
  );
};

export const formatComplexPrice = (asset?: IAsset): string => {
  return (
    asset?.components
      .map(component =>
        formatEther(
          component.amount,
          component.contract!.decimals,
          component.contract!.symbol
            ? component.contract!.symbol
            : `${component.contract!.contractType || ""} ${component.template!.title}`,
        ),
      )
      .join(", ") || ""
  );
};

export const formatPenalty = (penalty?: number): number => {
  return penalty ? +(penalty / 100).toFixed(2) : 0;
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
