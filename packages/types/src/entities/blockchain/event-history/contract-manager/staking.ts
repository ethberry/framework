import { IContractManagerCommonDeployedEvent } from "./common";

export interface IStakingDeployedEventArgs {
  contractTemplate: string;
}

export interface IContractManagerStakingDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IStakingDeployedEventArgs;
}
