export interface IERC721TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC721TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC721TokenDeployedEventArgs;
}
