import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStakingRule extends ISearchable {
  depositId: number;
  deposit?: IAsset;
  rewardId: number;
  reward?: IAsset;
  duration: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
  externalId: string;
}
