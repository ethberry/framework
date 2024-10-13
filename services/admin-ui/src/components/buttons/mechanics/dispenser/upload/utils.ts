import { TokenType } from "@framework/types";

export interface IAssetItem {
  tokenType: string;
  token: string;
  tokenId: bigint;
  amount: bigint;
}

export const getEthPrice = (assets?: Array<IAssetItem>) => {
  return assets?.reduce((memo, current) => {
    if (current.tokenType === Object.values(TokenType).indexOf(TokenType.NATIVE).toString()) {
      return memo + current.amount;
    }
    return memo;
  }, 0n);
};
