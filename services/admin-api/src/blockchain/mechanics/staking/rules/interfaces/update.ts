import { DurationUnit, IAssetDto, StakingRuleStatus } from "@framework/types";

export interface IStakingUpdateDto {
  title: string;
  description: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  recurrent: boolean;
  stakingRuleStatus: StakingRuleStatus;
}
