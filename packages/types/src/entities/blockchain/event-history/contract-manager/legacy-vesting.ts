import { IContractManagerCommonDeployedEvent } from "./common";

export interface IVestingDeployedEventArgs {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  contractTemplate: string;
}

export interface IContractManagerLegacyVestingDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IVestingDeployedEventArgs;
}
