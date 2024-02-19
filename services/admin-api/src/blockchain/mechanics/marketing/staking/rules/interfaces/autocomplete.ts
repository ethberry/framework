import { StakingRuleStatus } from "@framework/types";

export interface IStakingRuleAutocompleteDto {
  stakingRuleStatus: Array<StakingRuleStatus>;
  stakingId: number;
}
