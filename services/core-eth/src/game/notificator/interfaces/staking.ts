import { IAssetDto } from "@framework/types";

export interface IStakingDepositStartData {
  account: string;
  externalId: number;
  startTimestamp: number;
  stakingRuleId: number;
}

export interface IStakingDepositFinishData {
  account: string;
  externalId: number;
  startTimestamp: number;
  multiplier: number;
}

export interface IStakingRuleCreatedData {
  externalId: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  penalty: number;
  recurrent: boolean;
}

export interface IStakingRuleUpdatedData {
  externalId: string;
  active: boolean;
}
