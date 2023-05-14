export interface IStakingStartData {
  account: string;
  externalId: number;
  startTimestamp: number;
  stakingRuleId: number;
}

export interface IStakingFinishData {
  account: string;
  externalId: number;
  startTimestamp: number;
  multiplier: number;
}
