import { IContractManagerCommonDeployedEvent } from "./common";

export interface ILotteryConfig {
  timeLagBeforeRelease: string;
  commission: string;
}

export interface ILotteryDeployedEventArgs {
  config: ILotteryConfig;
}

export interface IContractManagerLotteryDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: ILotteryDeployedEventArgs;
}
