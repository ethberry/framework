import { IContractManagerCommonDeployedEvent } from "./common";

export interface IMysteryTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerMysteryTokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IMysteryTokenDeployedEventArgs;
}
