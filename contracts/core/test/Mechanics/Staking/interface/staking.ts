import { BigNumber } from "ethers";

export interface IRule {
  deposit: IAsset;
  reward: IAsset;
  period: BigNumber;
  penalty: BigNumber;
  recurrent: boolean;
  active: boolean;
  externalId: BigNumber;
}

export interface IAsset {
  tokenType: BigNumber;
  token: string;
  tokenId: BigNumber;
  amount: BigNumber;
}
