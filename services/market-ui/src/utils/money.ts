import { BigNumber, BigNumberish, utils, FixedNumber } from "ethers";
import { IAsset, TokenType } from "@framework/types";

export const formatUnitsR = (value: BigNumberish, decimals: string | BigNumberish = 0, maxDecimalDigits?: number) => {
  return FixedNumber.from(utils.formatUnits(value, decimals))
    .round(maxDecimalDigits ?? BigNumber.from(decimals).toNumber())
    .toString();
};

export const formatEther = (amount = "0", decimals = 18, currency = "Ξ", maxDecimalDigits?: number): string => {
  return `${currency} ${formatUnitsR(amount, decimals, maxDecimalDigits)}`;
};

/**
 * @deprecated use formatItem
 */
export const formatPrice = (asset?: IAsset, maxDecimalDigits?: number): string => {
  return (
    asset?.components
      .map(component =>
        formatEther(component.amount, component.contract!.decimals, component.contract!.symbol, maxDecimalDigits),
      )
      .join(", ") || ""
  );
};

export const formatItem = (asset?: IAsset, maxDecimalDigits?: number): string => {
  return (
    asset?.components
      .map(component => {
        switch (component.contract?.contractType) {
          case TokenType.NATIVE:
          case TokenType.ERC20:
            return formatEther(
              component.amount,
              component.contract.decimals,
              component.contract.symbol,
              maxDecimalDigits,
            );
          case TokenType.ERC721:
          case TokenType.ERC998:
          case TokenType.ERC1155:
            return component.templateId
              ? BigInt(component.amount) > 1n
                ? `${component.amount} x ${component.template?.title}`
                : component.tokenId
                  ? `${component.template?.title} #${component.token!.tokenId}`
                  : component.template?.title
              : `${component.amount === "1" ? "" : `${component.amount} x`} ${component.contract.title}`;
          default:
            return "unsupported token type";
        }
      })
      .join(", ") || ""
  );
};

/**
 * @deprecated use formatItem
 */
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
  const total = asset?.components.reduce((memo, current) => {
    if (current.tokenType === TokenType.NATIVE) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
  return total || BigNumber.from(0);
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
