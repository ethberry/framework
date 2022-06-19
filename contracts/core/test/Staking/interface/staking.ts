import { BigNumber } from "ethers";

export interface IRule {
  deposit: IItem;
  reward: IItem;
  period: BigNumber;
  penalty: BigNumber;
  recurrent: boolean;
  active: boolean;
}

export interface IItem {
  itemType: BigNumber;
  token: string;
  tokenData: IItemData;
  amount: BigNumber;
}

export interface IItemData {
  tokenId: BigNumber;
  templateId: BigNumber;
}
