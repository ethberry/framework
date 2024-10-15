import { BigNumber } from "ethers";

import { TokenType } from "@framework/types";

export interface IAssetItem {
  tokenType: string;
  token: string;
  tokenId: number;
  amount: BigNumber;
}

export const getEthPrice = (assets?: Array<IAssetItem>) => {
  return assets?.reduce((memo, current) => {
    if (current.tokenType === Object.values(TokenType).indexOf(TokenType.NATIVE).toString()) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};
