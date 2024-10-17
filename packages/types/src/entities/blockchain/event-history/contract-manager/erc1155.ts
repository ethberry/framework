import { IContractManagerCommonDeployedEvent } from "./common";

export interface IERC1155TokenDeployedEventArgs {
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC1155TokenDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IERC1155TokenDeployedEventArgs;
}
