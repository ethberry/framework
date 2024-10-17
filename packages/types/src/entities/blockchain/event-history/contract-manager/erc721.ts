import { IContractManagerCommonDeployedEvent } from "./common";

export interface IERC721TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC721TokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IERC721TokenDeployedEventArgs;
}
