import { ISearchable, IIdBase } from "@gemunion/types-collection";
import { TokenType } from "./common";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStakingItem extends IIdBase {
  tokenType: TokenType;
  collection: number;
  criteria: number;
  amount: string;
}

export interface IStaking extends ISearchable {
  deposit: IStakingItem;
  reward: IStakingItem;
  duration: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
}
