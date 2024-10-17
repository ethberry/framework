import { IContractManagerCommonDeployedEvent } from "./common";

export interface IERC998TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC998TokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IERC998TokenDeployedEventArgs;
}
