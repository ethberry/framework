import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStaking extends ISearchable {
  deposit: IAsset;
  reward: IAsset;
  duration: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
  ruleId: string;
}
