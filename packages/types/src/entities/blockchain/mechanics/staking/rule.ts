import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import { DurationUnit } from "../../../common";
import { IContract } from "../../hierarchy/contract";

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
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  recurrent: boolean;
  stakingRuleStatus: StakingRuleStatus;
  externalId: string;
  contractId: number;
  contract?: IContract;
}
