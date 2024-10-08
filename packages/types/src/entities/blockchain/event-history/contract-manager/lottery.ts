export interface ILotteryConfig {
  timeLagBeforeRelease: string;
  commission: string;
}

export interface ILotteryDeployedEventArgs {
  config: ILotteryConfig;
}

export interface IContractManagerLotteryDeployedEvent {
  account: string;
  externalId: number;
  args: ILotteryDeployedEventArgs;
}
