import { BigNumber } from "ethers";

export interface IRule {
  deposit: IItem;
  reward: IItem;
  period: BigNumber;
  penalty: BigNumber;
  recurrent: boolean;
  active: boolean;
  externalId: BigNumber;
}

export interface IItem {
  itemType: BigNumber;
  token: string;
  tokenId: BigNumber;
  amount: BigNumber;
}
