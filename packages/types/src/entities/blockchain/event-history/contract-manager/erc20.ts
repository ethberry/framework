import { IContractManagerCommonDeployedEvent } from "./common";

export interface IERC20TokenDeployedEventArgs {
  name: string;
  symbol: string;
  cap: string;
  contractTemplate: string;
}

export interface IContractManagerERC20TokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IERC20TokenDeployedEventArgs;
}
