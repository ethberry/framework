export interface IERC1155TokenDeployedEventArgs {
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC1155TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC1155TokenDeployedEventArgs;
}
