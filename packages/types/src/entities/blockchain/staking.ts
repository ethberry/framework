import { ISearchable, IIdBase } from "@gemunion/types-collection";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ItemType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export interface IStakingItem extends IIdBase {
  itemType: ItemType;
  token: string;
  criteria: string;
  amount: string;
}

export interface IStaking extends ISearchable {
  deposit: IStakingItem;
  reward: IStakingItem;
  period: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
}
