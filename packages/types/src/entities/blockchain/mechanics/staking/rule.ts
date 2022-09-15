import type { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../asset";

export enum StakingRuleStatus {
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
  stakingRuleStatus: StakingRuleStatus;
  externalId: string;
}
