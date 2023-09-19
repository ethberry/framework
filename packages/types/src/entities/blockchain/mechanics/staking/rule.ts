import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import { DurationUnit } from "../../../common";
import { IContract } from "../../hierarchy/contract";

export enum StakingRuleStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum StakingDepositTokenType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC998 = "ERC998",
  ERC1155 = "ERC1155",
}

export enum StakingRewardTokenType {
  NONE = "NONE",
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC998 = "ERC998",
  ERC1155 = "ERC1155",
  MYSTERY = "MYSTERY",
}

export interface IStakingRule extends ISearchable {
  depositId: number;
  deposit?: IAsset;
  rewardId: number;
  reward?: IAsset;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  maxStake: number;
  recurrent: boolean;
  stakingRuleStatus: StakingRuleStatus;
  externalId: string;
  contractId: number;
  contract?: IContract;
}
