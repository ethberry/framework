import { ISearchable } from "@gemunion/types-collection";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStaking extends ISearchable {
  depositType: number;
  depositToken: string;
  depositTokenId: string;
  depositAmount: string;
  rewardType: number;
  rewardToken: string;
  rewardTokenId: string;
  rewardAmount: string;
  period: number;
  penalty: number;
  recurrent: number;
  stakingStatus: StakingStatus;
}
