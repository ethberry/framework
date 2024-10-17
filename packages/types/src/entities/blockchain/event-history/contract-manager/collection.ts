import { IContractManagerCommonDeployedEvent } from "./common";

export interface ICollectionDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  batchSize: string;
  contractTemplate: string;
}

export interface IContractManagerCollectionDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: ICollectionDeployedEventArgs;
}
