import { IContractManagerCommonDeployedEvent } from "./common";

export interface ILootTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerLootTokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: ILootTokenDeployedEventArgs;
}
